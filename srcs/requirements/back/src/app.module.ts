import { EventsModule } from './events/events.module';

import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';

import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';

import { WaiterController } from './waiters/waiter.controller';
import { WaiterService } from './waiters/waiter.service';

@Module({
  imports: [EventsModule],
  controllers: [MessageController, UserController, WaiterController],
  providers: [MessageService, UserService, PrismaService, WaiterService],
})
export class AppModule {}