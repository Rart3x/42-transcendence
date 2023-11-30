import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';

import { MessageService } from './message.service';

import { MessageController } from './message.controller';

@Module({
    imports: [PrismaModule],
    providers: [MessageService],
    controllers: [MessageController],
    exports: [MessageService],
})

export class MessageModule {}
