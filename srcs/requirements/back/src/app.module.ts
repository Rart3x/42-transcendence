import { Module } from '@nestjs/common';

import { ChannelModule } from './channel/channel.module';
import { EventsModule } from './events/events.module';
import { GameRoomModule } from './gameRoom/gameRoom.module';
import { MessageModule } from './message/message.module';
import { PrivateMessageModule } from './privateMessage/privateMessage.module';
import { UserModule } from './user/user.module';

import { ChannelController } from './channel/channel.controller'
import { ChannelService } from './channel/channel.service';

import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';

import { PrismaService } from './prisma.service';

import { PrivateMessageController } from './privateMessage/privateMessage.controller';
import { PrivateMessageService } from './privateMessage/privateMessage.service';

import { QueueListController } from './queueList/queueList.controller';
import { QueueListService } from './queueList/queueList.service';

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [ChannelModule, EventsModule, GameRoomModule, MessageModule, PrivateMessageModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
