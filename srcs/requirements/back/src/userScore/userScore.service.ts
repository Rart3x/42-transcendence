import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma, UserScore } from '@prisma/client';

@Injectable()
export class UserScoreService {
  constructor (
    private prisma: PrismaService) {}

    async createUserScore(
        scorerId: number,
        scoreIdPlayer1: number,
        scoreIdPlayer2: number) : Promise<UserScore>{

        return await this.prisma.userScore.create({
          data: {
            time: new Date(),
            scoreA: scoreIdPlayer1,
            scoreB: scoreIdPlayer2,
            scorerId: scorerId,
          }
        })
    }
}
