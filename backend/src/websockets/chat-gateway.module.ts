import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from '../users/users.module';
import { MessagesModule } from '../messages/messages.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    MessagesModule,
    RedisModule,
  ],
  providers: [ChatGateway],
})
export class ChatGatewayModule {}
