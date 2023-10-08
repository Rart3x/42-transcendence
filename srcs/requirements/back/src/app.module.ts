import { Module } from '@nestjs/common';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class AppModule {}