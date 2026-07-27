import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminUsersService } from './admin-users.service';
import { AdminReportsService } from './admin-reports.service';
import { AdminFeedbackService } from './admin-feedback.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  GetReportDto,
  CompareMonthDto,
  SeriesQueryDto,
} from './dto/get-report.dto';
import { ReplyFeedbackDto } from './dto/reply-feedback.dto';
import {
  UpdateUserPlanDto,
  GetUsersQueryDto,
  SubmitFeedbackDto,
} from './dto/admin-user.dto';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request';

// ── Guard dùng chung cho toàn bộ Admin routes ──────────────────
const AdminGuards = [JwtAuthGuard, RolesGuard];

@Controller()
export class AdminController {
  constructor(
    private readonly dashboardService: AdminDashboardService,
    private readonly usersService: AdminUsersService,
    private readonly reportsService: AdminReportsService,
    private readonly feedbackService: AdminFeedbackService,
  ) {}

  // ════════════════════════════════════════════════════════════
  // DASHBOARD
  // ════════════════════════════════════════════════════════════

  /**
   * GET /admin/dashboard
   * Tổng quan: số user, doanh thu, feedback chờ xử lý...
   */
  @UseGuards(...AdminGuards)
  @Roles('ADMIN')
  @Get('admin/dashboard')
  getDashboard() {
    return this.dashboardService.getDashboard();
  }

  // ════════════════════════════════════════════════════════════
  // QUẢN LÝ NGƯỜI DÙNG
  // ════════════════════════════════════════════════════════════

  /**
   * GET /admin/users?plan=PREMIUM&search=nguyen&page=1&limit=20
   */
  @UseGuards(...AdminGuards)
  @Roles('ADMIN')
  @Get('admin/users')
  getUsers(@Query() query: GetUsersQueryDto) {
    return this.usersService.getUsers(query);
  }

  /**
   * PATCH /admin/users/:id/plan
   * Admin cập nhật gói của user (có thể tặng hoặc hạ xuống FREE)
   */
  @UseGuards(...AdminGuards)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch('admin/users/:id/plan')
  updateUserPlan(@Param('id') id: string, @Body() body: UpdateUserPlanDto) {
    return this.usersService.updateUserPlan(id, body.plan);
  }

  // ════════════════════════════════════════════════════════════
  // BÁO CÁO NGƯỜI DÙNG MỚI
  // ════════════════════════════════════════════════════════════

  /**
   * GET /admin/reports/users?from=2026-01-01&to=2026-03-31&groupBy=day
   */
  @UseGuards(...AdminGuards)
  @Roles('ADMIN')
  @Get('admin/reports/users')
  getNewUsersReport(@Query() query: GetReportDto) {
    return this.reportsService.getNewUsersReport(query);
  }

  // ════════════════════════════════════════════════════════════
  // BÁO CÁO DOANH THU
  // ════════════════════════════════════════════════════════════

  /**
   * GET /admin/reports/revenue?from=2026-01-01&to=2026-03-31&groupBy=month
   */
  @UseGuards(...AdminGuards)
  @Roles('ADMIN')
  @Get('admin/reports/revenue')
  getRevenueReport(@Query() query: GetReportDto) {
    return this.reportsService.getRevenueReport(query);
  }

  // ════════════════════════════════════════════════════════════
  // TIME-SERIES CHO BIỂU ĐỒ DASHBOARD (Reports.tsx)
  // ════════════════════════════════════════════════════════════

  /**
   * GET /admin/reports/revenue-series?days=7
   * Doanh thu theo ngày (breakdown PREMIUM/VIP) cho biểu đồ cột.
   */
  @UseGuards(...AdminGuards)
  @Roles('ADMIN')
  @Get('admin/reports/revenue-series')
  getRevenueSeries(@Query() query: SeriesQueryDto) {
    return this.reportsService.getRevenueSeries(query.days);
  }

  /**
   * GET /admin/reports/usage-series?days=7
   * Lượt quét ảnh + lượt chat AI theo ngày cho biểu đồ vùng.
   */
  @UseGuards(...AdminGuards)
  @Roles('ADMIN')
  @Get('admin/reports/usage-series')
  getUsageSeries(@Query() query: SeriesQueryDto) {
    return this.reportsService.getUsageSeries(query.days);
  }

  // ════════════════════════════════════════════════════════════
  // SO SÁNH 2 THÁNG
  // ════════════════════════════════════════════════════════════

  /**
   * GET /admin/reports/compare?month1=2026-01-01&month2=2026-02-01
   */
  @UseGuards(...AdminGuards)
  @Roles('ADMIN')
  @Get('admin/reports/compare')
  compareMonths(@Query() query: CompareMonthDto) {
    return this.reportsService.compareMonths(query.month1, query.month2);
  }

  // ════════════════════════════════════════════════════════════
  // XUẤT FILE BÁO CÁO CSV
  // ════════════════════════════════════════════════════════════

  /**
   * GET /admin/export/revenue?from=2026-01-01&to=2026-03-31
   * Trả về file CSV doanh thu để admin tải về
   */
  @UseGuards(...AdminGuards)
  @Roles('ADMIN')
  @Get('admin/export/revenue')
  async exportRevenueCsv(
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const csv = await this.reportsService.exportRevenueReportCsv(from, to);
    const filename = `revenue_${from}_to_${to}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    // BOM để Excel mở file UTF-8 không bị lỗi tiếng Việt
    res.send('\uFEFF' + csv);
  }

  /**
   * GET /admin/export/users?from=2026-01-01&to=2026-03-31
   * Trả về file CSV danh sách user mới đăng ký
   */
  @UseGuards(...AdminGuards)
  @Roles('ADMIN')
  @Get('admin/export/users')
  async exportUsersCsv(
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const csv = await this.reportsService.exportUsersReportCsv(from, to);
    const filename = `users_${from}_to_${to}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv);
  }

  // ════════════════════════════════════════════════════════════
  // FEEDBACK
  // ════════════════════════════════════════════════════════════

  /**
   * POST /feedback
   * Người dùng thường gửi feedback (chỉ cần đăng nhập, không cần ADMIN)
   */
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('feedback')
  submitFeedback(
    @Req() req: AuthenticatedRequest,
    @Body() body: SubmitFeedbackDto,
  ) {
    return this.feedbackService.submitFeedback(req.user.userId, body);
  }

  /**
   * GET /admin/feedbacks?status=PENDING&page=1
   * Admin xem danh sách feedback
   */
  @UseGuards(...AdminGuards)
  @Roles('ADMIN')
  @Get('admin/feedbacks')
  getFeedbacks(
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.feedbackService.getFeedbacks(status, +page, +limit);
  }

  /**
   * POST /admin/feedbacks/:id/reply
   * Admin trả lời feedback của user
   */
  @UseGuards(...AdminGuards)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Post('admin/feedbacks/:id/reply')
  replyFeedback(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: ReplyFeedbackDto,
  ) {
    return this.feedbackService.replyFeedback(id, req.user.userId, body.reply);
  }

  /**
   * GET /feedback
   * Người dùng xem lại lịch sử các phản hồi của chính mình
   */
  @UseGuards(JwtAuthGuard)
  @Get('feedback')
  getUserFeedbacks(
    @Req() req: AuthenticatedRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    // Lấy userId từ token đăng nhập để tìm đúng phản hồi của người đó
    return this.feedbackService.getUserFeedbacks(
      req.user.userId,
      +page,
      +limit,
    );
  }
}
