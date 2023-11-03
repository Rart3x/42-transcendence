import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';

import { ChannelService } from './channel.service';
import { MessageService } from '../message/message.service';

import { PrismaModule } from '../prisma.module';
import { UserService } from '../user/user.service';

@Module({
    imports: [PrismaModule],
    controllers: [ChannelController],
    providers: [ChannelService, MessageService, UserService],
    exports: [ChannelService]
})

export class ChannelModule {}
