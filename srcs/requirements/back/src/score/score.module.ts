import { Module, Global, Controller } from '@nestjs/common';
import { ScoreService } from './score.service';
import { PrismaModule } from '../prisma.module';
import { ScoreController } from './score.controller';
import { UserModule } from '../user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';

@Module({
    imports: [PrismaModule, UserModule],
    controllers: [ScoreController],
    providers: [
        ScoreService,
  
    ],
    exports: [ScoreService]
})

export class ScoreModule {}
