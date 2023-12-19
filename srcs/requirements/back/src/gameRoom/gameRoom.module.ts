import { Module, Global } from '@nestjs/common';
import { GameRoomService } from './gameRoom.service';
import { PrismaModule } from '../prisma.module';
import { GameRoomController } from './gameRoom.controller';
import { UserModule } from '../user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';

@Module({
    imports: [PrismaModule, UserModule],
    controllers: [GameRoomController],
    providers: [
        GameRoomService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        }
    ],
    exports: [GameRoomService]
})

export class GameRoomModule {}
