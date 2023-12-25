import { Module } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { GatewayModule } from './gateway/gateway.module';

import { ChannelModule } from './channel/channel.module';
import { EventsModule } from './game/game.module';
import { GameRoomModule } from './gameRoom/gameRoom.module';
import { MessageModule } from './message/message.module';
import { PrivateMessageModule } from './privateMessage/privateMessage.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { ChannelController } from './channel/channel.controller'
import { ChannelService } from './channel/channel.service';

import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';

import { PrismaService } from './prisma.service';

import { PrivateMessageController } from './privateMessage/privateMessage.controller';
import { PrivateMessageService } from './privateMessage/privateMessage.service';

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ChannelModule,
    EventsModule,
    GameRoomModule,
    GatewayModule,
    MessageModule,
    PrivateMessageModule,
    UserModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
  }),
  ],
  controllers: [
    ChannelController,
    MessageController,
    PrivateMessageController,
    UserController,
  ],
  providers: [
    ChannelService,
    MessageService,
    PrismaService,
    PrivateMessageService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AppModule {}