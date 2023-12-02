import { Module } from '@nestjs/common';
import { EventsGateway } from './game.gateway';
import { PrismaModule } from '../prisma.module';
import { PrismaService } from '../prisma.service';
import { GameRoomModule } from '../gameRoom/gameRoom.module';
import { UserModule } from '../user/user.module';
import { ScoreModule } from '../score/score.module';

@Module({
  imports: [PrismaModule, GameRoomModule, UserModule, ScoreModule],
  providers: [EventsGateway],
})

export class EventsModule {}
