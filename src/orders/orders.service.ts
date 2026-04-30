import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { Notification, NotificationDocument } from '../users/schemas/notification.schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel('Notification') private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  private extractVoucherIdFromQrString(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const match = value.match(/^voucher-(VOUCHER-\d+)-[A-Za-z0-9]+$/);
    return match?.[1] || null;
  }

  async createOrder(
    userId: string,
    merchantId: string,
    amount: number,
    itemsCount = 1,
    voucherId?: string,
  ) {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const order = new this.orderModel({
      userId: new Types.ObjectId(userId),
      merchantId: new Types.ObjectId(merchantId),
      orderNumber,
      amount,
      itemsCount,
      status: OrderStatus.PENDING,
      placedAt: new Date(),
      voucherId,
    });

    await order.save();

    // Notify the merchant about the new order
    try {
      const merchant = await this.userModel.findById(merchantId).select('name email').lean().exec();
      const customer = await this.userModel.findById(userId).select('name').lean().exec();

      if (merchant && customer) {
        await this.notificationModel.create({
          recipientId: String(merchantId),
          senderId: String(userId),
          senderName: (customer as any).name || 'Customer',
          adId: order.voucherId || 'order',
          adTitle: `New order from ${(customer as any).name || 'Customer'}`,
          type: 'order_placed',
          message: `${(customer as any).name || 'Customer'} claimed your offer`,
          read: false,
        });
        this.logger.log(
          `Notification created for merchant ${merchantId} for order ${order.orderNumber}`,
        );
      }
    } catch (notifError) {
      this.logger.error(`Failed to create notification: ${(notifError as Error).message}`);
    }

    return {
      success: true,
      message: 'Order placed successfully',
      data: {
        _id: String(order._id),
        orderNumber: order.orderNumber,
        amount: order.amount,
        itemsCount: order.itemsCount,
        status: order.status,
        placedAt: order.placedAt,
        voucherId: order.voucherId,
      },
    };
  }
  async getMerchantOrders(merchantId: string, page = 1, limit = 20, status?: string) {
    const query: any = { merchantId: new Types.ObjectId(merchantId) };
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.orderModel.find(query).sort({ placedAt: -1 }).skip(skip).limit(limit).lean(),
      this.orderModel.countDocuments(query),
    ]);

    const userIds = orders.map((o) => o.userId).filter(Boolean);
    const users = await this.userModel.find({ _id: { $in: userIds } }).select('name').lean();
    const userMap = new Map(users.map((u: any) => [String(u._id), u.name]));

    return {
      success: true,
      data: orders.map((o: any) => ({
        _id: String(o._id),
        orderNumber: o.orderNumber,
        amount: o.amount,
        itemsCount: o.itemsCount,
        status: o.status,
        placedAt: o.placedAt,
        acceptedAt: o.acceptedAt,
        completedAt: o.completedAt,
        voucherId: o.voucherId,
        customerName: userMap.get(String(o.userId)) || 'Unknown Customer',
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async getMerchantOrderStats(merchantId: string) {
    const mId = new Types.ObjectId(merchantId);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [todayOrders, pendingOrders, acceptedOrders, completedOrders, rejectedOrders, revenueAgg] =
      await Promise.all([
        this.orderModel.countDocuments({ merchantId: mId, placedAt: { $gte: startOfDay } }),
        this.orderModel.countDocuments({ merchantId: mId, status: OrderStatus.PENDING }),
        this.orderModel.countDocuments({ merchantId: mId, status: OrderStatus.ACCEPTED }),
        this.orderModel.countDocuments({ merchantId: mId, status: OrderStatus.COMPLETED }),
        this.orderModel.countDocuments({ merchantId: mId, status: OrderStatus.REJECTED }),
        this.orderModel.aggregate([
          {
            $match: {
              merchantId: mId,
              status: { $in: [OrderStatus.ACCEPTED, OrderStatus.COMPLETED] },
            },
          },
          { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
        ]),
      ]);

    const totalRevenue = revenueAgg?.[0]?.totalRevenue || 0;

    return {
      success: true,
      data: {
        todayOrders,
        pendingOrders,
        acceptedOrders,
        completedOrders,
        rejectedOrders,
        totalRevenue,
      },
    };
  }
  async updateOrderStatus(merchantId: string, orderId: string, status: OrderStatus) {
    if (!Object.values(OrderStatus).includes(status)) {
      throw new BadRequestException('Invalid order status');
    }

    const order = await this.orderModel.findOne({
      _id: new Types.ObjectId(orderId),
      merchantId: new Types.ObjectId(merchantId),
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    if (status === OrderStatus.ACCEPTED) {
      order.acceptedAt = new Date();
    }
    if (status === OrderStatus.COMPLETED) {
      order.completedAt = new Date();
    }

    await order.save();

    // Notify the customer about the status change
    try {
      const merchant = await this.userModel.findById(merchantId).select('name').lean().exec();
      const customerId = String(order.userId);
      const merchantName = (merchant as any)?.name || 'Merchant';

      if (status === OrderStatus.ACCEPTED) {
        await this.notificationModel.create({
          recipientId: customerId,
          senderId: String(merchantId),
          senderName: merchantName,
          adId: order.voucherId || 'order',
          adTitle: `${merchantName} accepted your offer`,
          type: 'order_accepted',
          message: `${merchantName} accepted your claimed offer`,
          read: false,
        });
      } else if (status === OrderStatus.REJECTED) {
        await this.notificationModel.create({
          recipientId: customerId,
          senderId: String(merchantId),
          senderName: merchantName,
          adId: order.voucherId || 'order',
          adTitle: `${merchantName} rejected your offer`,
          type: 'order_rejected',
          message: `${merchantName} rejected your claimed offer`,
          read: false,
        });
      } else if (status === OrderStatus.COMPLETED) {
        await this.notificationModel.create({
          recipientId: customerId,
          senderId: String(merchantId),
          senderName: merchantName,
          adId: order.voucherId || 'order',
          adTitle: `${merchantName} completed your order`,
          type: 'order_completed',
          message: `Your order with ${merchantName} has been completed`,
          read: false,
        });
      }
    } catch (notifError) {
      this.logger.error(`Failed to create status update notification: ${(notifError as Error).message}`);
    }

    return {
      success: true,
      message: 'Order status updated',
      data: {
        _id: String(order._id),
        status: order.status,
        acceptedAt: order.acceptedAt,
        completedAt: order.completedAt,
      },
    };
  }

  async completeOrderByVoucherId(merchantId: string, voucherId: string) {
    const order = await this.orderModel
      .findOne({
        merchantId: new Types.ObjectId(merchantId),
        voucherId,
        status: { $in: [OrderStatus.ACCEPTED, OrderStatus.PENDING] },
      })
      .sort({ placedAt: -1 });

    if (!order) {
      return {
        success: false,
        message: 'No open order found for this voucher',
      };
    }

    return this.updateOrderStatus(merchantId, String(order._id), OrderStatus.COMPLETED);
  }
  async completeOrderWithQr(merchantId: string, orderId: string, qrData: any) {
    if (!qrData) {
      throw new BadRequestException('Missing qrData');
    }

    const order = await this.orderModel.findOne({
      _id: new Types.ObjectId(orderId),
      merchantId: new Types.ObjectId(merchantId),
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Determine offer/voucher id from payload (supports both JSON payload and raw voucher-* QR string)
    const payloadOffer =
      qrData?.offerId ||
      qrData?.voucherId ||
      qrData?.voucher ||
      this.extractVoucherIdFromQrString(qrData);
    const orderOffer = order.voucherId;
    if (String(payloadOffer) !== String(orderOffer)) {
      throw new BadRequestException('QR does not match order');
    }

    // Verify user name
    const customer = await this.userModel.findById(order.userId).select('name').lean().exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    if ((qrData.userName || '') !== (customer.name || '')) {
      throw new BadRequestException('QR user does not match order');
    }

    order.status = OrderStatus.COMPLETED;
    order.completedAt = new Date();
    await order.save();

    // Notify customer
    try {
      const merchant = await this.userModel.findById(merchantId).select('name').lean().exec();
      const merchantName = (merchant as any)?.name || 'Merchant';
      await this.notificationModel.create({
        recipientId: String(order.userId),
        senderId: String(merchantId),
        senderName: merchantName,
        adId: order.voucherId || 'order',
        adTitle: `${merchantName} completed your order`,
        type: 'order_completed',
        message: `${merchantName} completed your claimed offer`,
        read: false,
      });
    } catch (notifError) {
      this.logger.error(`Failed to create completion notification: ${(notifError as Error).message}`);
    }

    return {
      success: true,
      message: 'Order completed',
      data: {
        _id: String(order._id),
        status: order.status,
        completedAt: order.completedAt,
      },
    };
  }
}
