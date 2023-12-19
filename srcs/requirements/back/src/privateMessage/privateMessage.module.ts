import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';

import { UserService } from '../user/user.service';
import { PrivateMessageService } from './privateMessage.service';

import { PrivateMessageController } from './privateMessage.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
@Module({
    imports: [PrismaModule],
    providers: [PrivateMessageService,
        UserService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        }
    ],
    controllers: [PrivateMessageController],
    exports: [PrivateMessageService],
})

export class PrivateMessageModule {}