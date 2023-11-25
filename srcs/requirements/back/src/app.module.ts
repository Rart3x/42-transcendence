import { Module } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SocketIoAdapter } from './socket-io.adapter';

import { AppGateway } from './app.gateway';

import { ChannelModule } from './channel/channel.module';
import { EventsModule } from './events/events.module';
import { GameRoomModule } from './gameRoom/gameRoom.module';
import { MessageModule } from './message/message.module';
import { NotifModule } from './notif/notif.module';
import { PrivateMessageModule } from './privateMessage/privateMessage.module';
import { UserModule } from './user/user.module';

import { ChannelController } from './channel/channel.controller'
import { ChannelService } from './channel/channel.service';

import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';

import { NotifController } from './notif/notif.controller';
import { NotifService } from './notif/notif.service';

import { PrismaService } from './prisma.service';

import { PrivateMessageController } from './privateMessage/privateMessage.controller';
import { PrivateMessageService } from './privateMessage/privateMessage.service';

import { QueueListController } from './queueList/queueList.controller';
import { QueueListService } from './queueList/queueList.service';

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [
    ChannelModule,
    EventsModule,
    GameRoomModule,
    MessageModule,
    NotifModule,
    PrivateMessageModule,
    UserModule,
  ],
  controllers: [
    ChannelController,
    NotifController,
    MessageController,
    PrivateMessageController,
    QueueListController,
    UserController,
  ],
  providers: [
    AppGateway,
    ChannelService,
    MessageService,
    NotifService,
    PrismaService,
    PrivateMessageService,
    QueueListService,
    UserService,
    {
      provide: IoAdapter,
      useClass: SocketIoAdapter,
    },
  ],
})
export class AppModule {}