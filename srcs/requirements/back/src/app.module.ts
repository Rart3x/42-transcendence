import { EventsModule } from './events/events.module';
import { Module } from '@nestjs/common';

import { ChannelController } from './channel/channel.controller';
import { ChannelService } from './channel/channel.service';

import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';

import { PrismaService } from './prisma.service';

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

import { QueueListController } from './queueList/queueList.controller';
import { QueueListService } from './queueList/queueList.service';

@Module({
  imports: [EventsModule],
  controllers: [ChannelController, MessageController, UserController, QueueListController],
  providers: [ChannelService, MessageService, UserService, PrismaService, QueueListService],
})
export class AppModule {}