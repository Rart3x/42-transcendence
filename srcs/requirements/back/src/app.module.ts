import { Module } from '@nestjs/common';
import { AppController } from './users/user.controller';
import { UserService } from './users/user.service';
import { PrismaService } from './users/prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [UserService, PrismaService],
})
export class AppModule {}