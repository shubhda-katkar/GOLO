import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  namespace: '/vouchers',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class VouchersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(VouchersGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const tokenFromAuth = client.handshake.auth?.token;
      const tokenFromHeader = client.handshake.headers.authorization?.replace('Bearer ', '');
      const token = tokenFromAuth || tokenFromHeader;

      if (!token) {
        throw new WsException('Authentication token is required');
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!payload?.sub) {
        throw new WsException('Invalid token payload');
      }

      const userId = String(payload.sub);
      client.data.userId = userId;
      client.join(`user:${userId}`);
      this.logger.debug(`Vouchers socket connected for user ${userId}: ${client.id}`);
    } catch (error) {
      this.logger.warn(`Vouchers socket auth failed: ${error.message}`);
      client.emit('voucher_error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Vouchers socket disconnected: ${client.id}`);
  }

  emitClaimedOfferCreated(userId: string, payload: any) {
    this.server.to(`user:${userId}`).emit('claimed_offer_created', payload);
  }
}

