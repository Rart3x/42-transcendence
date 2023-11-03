import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';

import { ChannelService } from './channel.service';

import { PrismaModule } from '../prisma.module';
import { UserService } from '../user/user.service';

@Module({
    imports: [PrismaModule],
    controllers: [ChannelController],
    providers: [ChannelService, UserService],
    exports: [ChannelService]
})

export class ChannelModule {}
