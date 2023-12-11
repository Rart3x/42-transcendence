import { Module, Global } from '@nestjs/common';
import { GameRoomService } from './gameRoom.service';
import { PrismaModule } from '../prisma.module';
import { GameRoomController } from './gameRoom.controller';
import { UserModule } from '../user/user.module';

@Module({
    imports: [PrismaModule, UserModule],
    controllers: [GameRoomController],
    providers: [GameRoomService],
    exports: [GameRoomService]
})

export class GameRoomModule {}
