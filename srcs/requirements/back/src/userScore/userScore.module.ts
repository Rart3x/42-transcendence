import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { UserScoreService } from './userScore.service';


@Module({
    imports: [PrismaModule],    
    providers: [UserScoreService],
    exports: [UserScoreService],
})

export class UserScoreModule {}
