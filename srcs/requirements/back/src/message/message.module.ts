import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';

import { MessageService } from './message.service';

import { MessageController } from './message.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';

@Module({
    imports: [PrismaModule],
    providers: [
        MessageService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        }
    ],
    controllers: [MessageController],
    exports: [MessageService],
})

export class MessageModule {}
