import { EventsModule } from './events/events.module';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { ChannelModule } from './channel/channel.module';

import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';

import { PrismaService } from './prisma.service';

import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

import { QueueListController } from './queueList/queueList.controller';
import { QueueListService } from './queueList/queueList.service';

@Module({
  imports: [EventsModule, UserModule, MessageModule, ChannelModule],
  controllers: [],
  providers: [],
})
export class AppModule {}