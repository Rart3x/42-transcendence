import { Module, Global } from '@nestjs/common';
import { QueueListController } from './queueList.controller';
import { QueueListService } from './queueList.service';
import { PrismaModule } from '../prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [QueueListController],
    providers: [QueueListService],
    exports: [QueueListService],
})

export class QueueListModule {}
