import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';

import { UserService } from '../user/user.service';
import { PrivateMessageService } from './privateMessage.service';

import { PrivateMessageController } from './privateMessage.controller';

@Module({
    imports: [PrismaModule],
    providers: [PrivateMessageService, UserService],
    controllers: [PrivateMessageController],
    exports: [PrivateMessageService],
})

export class PrivateMessageModule {}