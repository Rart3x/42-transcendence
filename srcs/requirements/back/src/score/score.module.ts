import { Module, Global, Controller } from '@nestjs/common';
import { ScoreService } from './score.service';
import { PrismaModule } from '../prisma.module';
import { ScoreController } from './score.controller';

@Module({
    imports: [PrismaModule],
    controllers: [ScoreController],
    providers: [ScoreService],
    exports: [ScoreService]
})

export class ScoreModule{}
