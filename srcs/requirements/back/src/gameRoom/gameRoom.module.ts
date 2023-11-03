import { Module, Global } from '@nestjs/common';
import { GameRoomService } from './gameRoom.service';
import { PrismaModule } from '../prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [],
    providers: [GameRoomService],
    exports: [GameRoomService]
})

export class GameRoomModule {}
