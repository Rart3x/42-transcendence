import { Module, Global } from '@nestjs/common';
import { ScoreService } from './score.service';
import { PrismaModule } from '../prisma.module';
import { UserScoreModule } from '../userScore/userScore.module';

@Module({
    imports: [PrismaModule, UserScoreModule],
    providers: [ScoreService],
    exports: [ScoreService]
})

export class ScoreModule{}
