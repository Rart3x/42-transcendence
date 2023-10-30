import { EventsModule } from './events/events.module';
import { Module } from '@nestjs/common';

import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';

import { PrismaService } from './prisma.service';

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

import { QueueListController } from './queueList/queueList.controller';
import { QueueListService } from './queueList/queueList.service';

@Module({
  imports: [EventsModule],
  controllers: [MessageController, UserController, QueueListController],
  providers: [MessageService, UserService, PrismaService, QueueListService],
})
export class AppModule {}