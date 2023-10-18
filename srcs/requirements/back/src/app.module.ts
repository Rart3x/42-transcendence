import { EventsModule } from './events/events.module';

import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';

import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';

import { QueueListController } from './queueList/queueList.controller';
import { QueueListService } from './queueList/queueList.service';

@Module({
  imports: [EventsModule],
  controllers: [MessageController, UserController, QueueListController],
  providers: [MessageService, UserService, PrismaService, QueueListService],
})
export class AppModule {}
