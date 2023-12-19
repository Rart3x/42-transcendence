import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';

import { ChannelService } from './channel.service';
import { MessageService } from '../message/message.service';

import { PrismaModule } from '../prisma.module';
import { UserService } from '../user/user.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    MessageService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
  exports: [ChannelService]
})

export class ChannelModule {}