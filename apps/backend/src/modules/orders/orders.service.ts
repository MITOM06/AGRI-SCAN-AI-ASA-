import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Order,
  OrderDocument,
  Product,
  ProductDocument,
} from '@agri-scan/database';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>, // Inject Product để check kho
  ) {}

  // 1. NGƯỜI MUA: ĐẶT HÀNG
  async createOrder(buyerId: string, dto: CreateOrderDto) {
    let totalAmount = 0;
    const orderItems: {
      productId: Types.ObjectId;
      quantity: number;
      priceAtPurchase: number;
    }[] = [];
    // Duyệt qua từng món hàng khách muốn mua
    for (const item of dto.items) {
      const product = await this.productModel.findById(item.productId);

      // Kiểm tra sản phẩm có tồn tại, có đang bán và đúng của Seller không
      if (!product || !product.isActive || product.status !== 'APPROVED') {
        throw new BadRequestException(
          `Sản phẩm ${item.productId} không tồn tại hoặc đã ngừng bán!`,
        );
      }
      if (product.sellerId.toString() !== dto.sellerId) {
        throw new BadRequestException(
          `Sản phẩm ${product.name} không thuộc về gian hàng này!`,
        );
      }

      // Kiểm tra tồn kho
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm ${product.name} chỉ còn ${product.stock} sản phẩm!`,
        );
      }

      // Tính tiền (Lấy giá hiện tại của Database, không lấy từ Frontend gửi lên)
      const price = product.price;
      totalAmount += price * item.quantity;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtPurchase: price,
      });

      // Trừ tồn kho và cộng lượt bán ngay lập tức bằng lệnh $inc (Atomic Update)
      await this.productModel.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    // Tạo hóa đơn
    const newOrder = new this.orderModel({
      buyerId: new Types.ObjectId(buyerId),
      sellerId: new Types.ObjectId(dto.sellerId),
      items: orderItems,
      totalAmount,
      shippingAddress: dto.shippingAddress,
      phoneNumber: dto.phoneNumber,
      paymentMethod: dto.paymentMethod,
      orderStatus: 'PENDING',
      paymentStatus: 'UNPAID',
    });

    return newOrder.save();
  }

  // 2. NGƯỜI MUA: Xem lịch sử đơn hàng của mình
  async getBuyerOrders(buyerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.orderModel
        .find({ buyerId: new Types.ObjectId(buyerId) })
        .populate('sellerId', 'fullName email') // Lấy tên shop
        .populate('items.productId', 'name images price') // Lấy hình ảnh, tên món hàng
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.orderModel.countDocuments({ buyerId: new Types.ObjectId(buyerId) }),
    ]);

    return {
      data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // 3. NGƯỜI BÁN (SHOP): Xem danh sách khách đặt hàng
  async getSellerOrders(sellerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.orderModel
        .find({ sellerId: new Types.ObjectId(sellerId) })
        .populate('buyerId', 'fullName email') // Lấy tên người mua
        .populate('items.productId', 'name images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.orderModel.countDocuments({
        sellerId: new Types.ObjectId(sellerId),
      }),
    ]);

    return {
      data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // 4. NGƯỜI BÁN / ADMIN: Cập nhật trạng thái đơn (Xác nhận, Đang giao, Hủy...)
  async updateOrderStatus(
    orderId: string,
    userId: string,
    userRole: string,
    dto: UpdateOrderStatusDto,
  ) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Không tìm thấy hóa đơn này!');

    // Chỉ Chủ Shop hoặc Admin mới có quyền đổi trạng thái đơn
    if (order.sellerId.toString() !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException(
        'Bạn không có quyền thao tác trên đơn hàng của shop khác!',
      );
    }

    // Nếu Hủy đơn hàng -> Phải hoàn lại tồn kho cho sản phẩm
    if (dto.status === 'CANCELLED' && order.orderStatus !== 'CANCELLED') {
      for (const item of order.items) {
        await this.productModel.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity, sold: -item.quantity },
        });
      }
      order.cancelReason = dto.cancelReason || 'Người bán hủy đơn';
    }

    // Cập nhật trạng thái
    order.orderStatus = dto.status;

    // Nếu giao thành công COD thì tự động set thành Đã thanh toán
    if (dto.status === 'DELIVERED' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'PAID';
    }

    await order.save();
    return { message: `Đã cập nhật trạng thái đơn hàng thành ${dto.status}` };
  }
}
