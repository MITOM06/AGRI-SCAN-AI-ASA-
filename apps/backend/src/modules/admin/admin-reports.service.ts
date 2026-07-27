import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, PipelineStage } from 'mongoose';
import {
  User,
  UserDocument,
  Payment,
  PaymentDocument,
  ScanHistory,
  ScanHistoryDocument,
  ChatHistory,
  ChatHistoryDocument,
} from '@agri-scan/database';
import { GetReportDto, GroupBy } from './dto/get-report.dto';
import type {
  RevenueSumRow,
  RevenueReportRow,
  TimeSeriesRow,
  RevenueSeriesPoint,
  UsageSeriesPoint,
  RevenueDayPlanRow,
  CountByDateRow,
} from './admin.types';

/**
 * Báo cáo & thống kê admin: user mới, doanh thu, time-series cho biểu đồ,
 * so sánh 2 tháng và xuất CSV.
 */
@Injectable()
export class AdminReportsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(ScanHistory.name)
    private scanHistoryModel: Model<ScanHistoryDocument>,
    @InjectModel(ChatHistory.name)
    private chatHistoryModel: Model<ChatHistoryDocument>,
  ) {}

  // ════════════════════════════════════════════════════════════
  // BÁO CÁO NGƯỜI DÙNG MỚI
  // ════════════════════════════════════════════════════════════
  async getNewUsersReport(dto: GetReportDto) {
    const { from, to, groupBy = GroupBy.DAY } = dto;
    const pipeline = this._buildTimeSeriesPipeline(from, to, groupBy, {
      role: { $ne: 'ADMIN' },
    });

    const result = await this.userModel.aggregate<TimeSeriesRow>(pipeline);
    return this._fillMissingDates(result, from, to, groupBy);
  }

  // ════════════════════════════════════════════════════════════
  // BÁO CÁO DOANH THU
  // ════════════════════════════════════════════════════════════
  async getRevenueReport(dto: GetReportDto) {
    const { from, to, groupBy = GroupBy.DAY } = dto;

    const groupFormat = groupBy === GroupBy.MONTH ? '%Y-%m' : '%Y-%m-%d';

    const pipeline: PipelineStage[] = [
      {
        $match: {
          status: 'SUCCESS',
          createdAt: {
            $gte: new Date(from),
            $lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
          },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: groupFormat, date: '$createdAt' },
            },
            plan: '$plan',
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          totalRevenue: { $sum: '$revenue' },
          totalTransactions: { $sum: '$count' },
          byPlan: {
            $push: {
              plan: '$_id.plan',
              revenue: '$revenue',
              count: '$count',
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const result =
      await this.paymentModel.aggregate<RevenueReportRow>(pipeline);

    // Tính tổng cộng
    const summary = result.reduce(
      (acc, item) => {
        acc.totalRevenue += item.totalRevenue;
        acc.totalTransactions += item.totalTransactions;
        return acc;
      },
      { totalRevenue: 0, totalTransactions: 0 },
    );

    return { summary, data: result };
  }

  // ════════════════════════════════════════════════════════════
  // TIME-SERIES DOANH THU (biểu đồ "Doanh thu theo gói")
  //     Nguồn: Payment (status=SUCCESS), gộp theo ngày + breakdown gói.
  // ════════════════════════════════════════════════════════════
  async getRevenueSeries(days = 7): Promise<RevenueSeriesPoint[]> {
    const { startDate, dayKeys } = this._buildDayKeys(days);

    const rows = await this.paymentModel.aggregate<RevenueDayPlanRow>([
      { $match: { status: 'SUCCESS', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            plan: '$plan',
          },
          revenue: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          plan: '$_id.plan',
          revenue: 1,
        },
      },
    ]);

    // Gom về map: date -> { PREMIUM, VIP }
    const map = new Map<string, { PREMIUM: number; VIP: number }>();
    for (const r of rows) {
      const entry = map.get(r.date) ?? { PREMIUM: 0, VIP: 0 };
      if (r.plan === 'PREMIUM') entry.PREMIUM += r.revenue;
      else if (r.plan === 'VIP') entry.VIP += r.revenue;
      map.set(r.date, entry);
    }

    return dayKeys.map((date) => {
      const e = map.get(date) ?? { PREMIUM: 0, VIP: 0 };
      return {
        date,
        revenue: e.PREMIUM + e.VIP,
        PREMIUM: e.PREMIUM,
        VIP: e.VIP,
      };
    });
  }

  // ════════════════════════════════════════════════════════════
  // TIME-SERIES LƯỢT DÙNG (biểu đồ "Tần suất sử dụng hệ thống")
  //     images  = số ScanHistory / ngày.
  //     prompts = số tin nhắn role='user' trong ChatHistory / ngày.
  // ════════════════════════════════════════════════════════════
  async getUsageSeries(days = 7): Promise<UsageSeriesPoint[]> {
    const { startDate, dayKeys } = this._buildDayKeys(days);

    const [imageRows, promptRows] = await Promise.all([
      // Lượt quét ảnh — gộp theo ngày tạo bản ghi ScanHistory
      this.scanHistoryModel.aggregate<CountByDateRow>([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, date: '$_id', count: 1 } },
      ]),
      // Lượt chat — bung mảng messages, chỉ đếm tin nhắn của người dùng
      this.chatHistoryModel.aggregate<CountByDateRow>([
        { $match: { updatedAt: { $gte: startDate } } },
        { $unwind: '$messages' },
        {
          $match: {
            'messages.role': 'user',
            'messages.timestamp': { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$messages.timestamp',
              },
            },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, date: '$_id', count: 1 } },
      ]),
    ]);

    const imageMap = new Map(imageRows.map((r) => [r.date, r.count]));
    const promptMap = new Map(promptRows.map((r) => [r.date, r.count]));

    return dayKeys.map((date) => ({
      date,
      images: imageMap.get(date) ?? 0,
      prompts: promptMap.get(date) ?? 0,
    }));
  }

  // ════════════════════════════════════════════════════════════
  // SO SÁNH 2 THÁNG
  // ════════════════════════════════════════════════════════════
  async compareMonths(month1: string, month2: string) {
    const getMonthRange = (dateStr: string) => {
      const d = new Date(dateStr);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      return { start, end };
    };

    const m1 = getMonthRange(month1);
    const m2 = getMonthRange(month2);

    const fetchMonthStats = async (start: Date, end: Date) => {
      const [newUsers, revenue, scans, premiumUsers, vipUsers] =
        await Promise.all([
          this.userModel.countDocuments({
            role: { $ne: 'ADMIN' },
            createdAt: { $gte: start, $lte: end },
          }),
          this.paymentModel.aggregate<RevenueSumRow>([
            {
              $match: {
                status: 'SUCCESS',
                createdAt: { $gte: start, $lte: end },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$amount' },
                count: { $sum: 1 },
              },
            },
          ]),
          this.scanHistoryModel.countDocuments({
            createdAt: { $gte: start, $lte: end },
          }),
          this.userModel.countDocuments({
            plan: 'PREMIUM',
            createdAt: { $gte: start, $lte: end },
          }),
          this.userModel.countDocuments({
            plan: 'VIP',
            createdAt: { $gte: start, $lte: end },
          }),
        ]);

      return {
        period: `${start.toISOString().substring(0, 7)}`,
        newUsers,
        revenue: revenue[0]?.total ?? 0,
        transactions: revenue[0]?.count ?? 0,
        scans,
        newPremiumUsers: premiumUsers,
        newVipUsers: vipUsers,
      };
    };

    const [stats1, stats2] = await Promise.all([
      fetchMonthStats(m1.start, m1.end),
      fetchMonthStats(m2.start, m2.end),
    ]);

    // Tính % thay đổi
    const calcChange = (v1: number, v2: number) => {
      if (v1 === 0) return v2 === 0 ? 0 : 100;
      return Number((((v2 - v1) / v1) * 100).toFixed(2));
    };

    return {
      month1: stats1,
      month2: stats2,
      changes: {
        newUsers: calcChange(stats1.newUsers, stats2.newUsers),
        revenue: calcChange(stats1.revenue, stats2.revenue),
        scans: calcChange(stats1.scans, stats2.scans),
        transactions: calcChange(stats1.transactions, stats2.transactions),
      },
    };
  }

  // ════════════════════════════════════════════════════════════
  // XUẤT BÁO CÁO CSV
  // ════════════════════════════════════════════════════════════
  async exportRevenueReportCsv(from: string, to: string): Promise<string> {
    const { data } = await this.getRevenueReport({
      from,
      to,
      groupBy: GroupBy.DAY,
    });

    const rows: (string | number)[][] = [
      ['Ngày', 'Tổng doanh thu (VND)', 'Số giao dịch', 'PREMIUM', 'VIP'],
    ];

    for (const item of data) {
      const premiumRow = item.byPlan.find((p) => p.plan === 'PREMIUM');
      const vipRow = item.byPlan.find((p) => p.plan === 'VIP');
      rows.push([
        item._id,
        item.totalRevenue,
        item.totalTransactions,
        premiumRow?.revenue ?? 0,
        vipRow?.revenue ?? 0,
      ]);
    }

    return rows.map((row) => row.join(',')).join('\n');
  }

  async exportUsersReportCsv(from: string, to: string): Promise<string> {
    const users = await this.userModel
      .find({
        role: { $ne: 'ADMIN' },
        createdAt: {
          $gte: new Date(from),
          $lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
        },
      })
      .select('email fullName plan createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const rows = [['Email', 'Họ tên', 'Gói', 'Ngày đăng ký']];
    for (const u of users) {
      rows.push([
        u.email,
        u.fullName,
        u.plan,
        u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '',
      ]);
    }

    return rows.map((row) => row.join(',')).join('\n');
  }

  // ════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ════════════════════════════════════════════════════════════

  /**
   * Sinh danh sách khoá ngày 'YYYY-MM-DD' (UTC) cho N ngày gần nhất,
   * kèm mốc bắt đầu (00:00 UTC của ngày đầu tiên) để dùng cho $match.
   */
  private _buildDayKeys(days: number): {
    startDate: Date;
    dayKeys: string[];
  } {
    const safeDays = Math.max(1, Math.floor(days));
    const cursor = new Date();
    cursor.setUTCHours(0, 0, 0, 0);
    cursor.setUTCDate(cursor.getUTCDate() - (safeDays - 1));

    const startDate = new Date(cursor);
    const dayKeys: string[] = [];
    for (let i = 0; i < safeDays; i++) {
      dayKeys.push(cursor.toISOString().slice(0, 10));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return { startDate, dayKeys };
  }

  private _buildTimeSeriesPipeline(
    from: string,
    to: string,
    groupBy: GroupBy,
    extraMatch: Record<string, unknown> = {},
  ): PipelineStage[] {
    const groupFormat = groupBy === GroupBy.MONTH ? '%Y-%m' : '%Y-%m-%d';

    return [
      {
        $match: {
          ...extraMatch,
          createdAt: {
            $gte: new Date(from),
            $lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: groupFormat, date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ];
  }

  // Điền 0 vào các ngày/tháng không có data để biểu đồ frontend không bị lỗ
  private _fillMissingDates(
    data: { date: string; count: number }[],
    from: string,
    to: string,
    groupBy: GroupBy,
  ) {
    const map = new Map(data.map((d) => [d.date, d.count]));
    const result: { date: string; count: number }[] = [];

    const cursor = new Date(from);
    const end = new Date(to);

    while (cursor <= end) {
      const key =
        groupBy === GroupBy.MONTH
          ? cursor.toISOString().substring(0, 7)
          : cursor.toISOString().substring(0, 10);

      result.push({ date: key, count: map.get(key) ?? 0 });

      if (groupBy === GroupBy.MONTH) {
        cursor.setMonth(cursor.getMonth() + 1);
      } else {
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    return result;
  }
}
