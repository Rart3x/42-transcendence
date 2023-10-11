import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';

@Module({
  imports: [],
  controllers: [MessageController, UserController],
  providers: [MessageService, UserService, PrismaService],
})
export class AppModule {}