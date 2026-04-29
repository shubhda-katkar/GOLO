import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';
import { VouchersGateway } from './vouchers.gateway';
import { Voucher, VoucherSchema } from './schemas/voucher.schema';
import { BannerPromotion, BannerPromotionSchema } from '../banners/schemas/banner-promotion.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Notification, NotificationSchema } from '../users/schemas/notification.schema';
import { KafkaModule } from '../kafka/kafka.module';
import { VouchersKafkaController } from './vouchers.kafka.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Voucher.name, schema: VoucherSchema },
      { name: BannerPromotion.name, schema: BannerPromotionSchema },
      { name: User.name, schema: UserSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => KafkaModule),
    forwardRef(() => OrdersModule),
  ],
  controllers: [VouchersController, VouchersKafkaController],
  providers: [VouchersService, VouchersGateway],
  exports: [VouchersService],
})
export class VouchersModule {}
