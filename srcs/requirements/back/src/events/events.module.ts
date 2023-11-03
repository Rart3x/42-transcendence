import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { QueueListService } from '../queueList/queueList.service';
import { QueueListModule } from '../queueList/queueList.module';
import { PrismaModule } from '../prisma.module';
import { PrismaService } from '../prisma.service';
import { GameRoomModule } from '../gameRoom/gameRoom.module';

@Module({
  imports: [QueueListModule, PrismaModule, GameRoomModule],
  providers: [EventsGateway],
})

export class EventsModule {}
