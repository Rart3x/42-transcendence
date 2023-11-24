import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma, Score } from '@prisma/client';

@Injectable()
export class ScoreService {
  constructor (
    private prisma: PrismaService) {}

    async updateGameRoomScore(
        gameRoomId: number,
        scorerId: number,
        scoreIdPlayer1: number,
        scoreIdPlayer2: number
        ): Promise<Score> {

        const score = await this.prisma.score.findFirst({
            where: { gameRoomId: gameRoomId }
        });

        if (!score){
            return await this.prisma.score.create({
                data:{
                    gameRoomId: gameRoomId,
                    score:{
                        create: {
                            time: new Date(),
                            scoreA: scoreIdPlayer1,
                            scoreB: scoreIdPlayer2,
                            scorerId: scorerId
                        }
                    }
                }
            })
        }
        else{
            await this.prisma.userScore.create({
                data: {
                    time: new Date(),
                    scoreA: scoreIdPlayer1,
                    scoreB: scoreIdPlayer2,
                    scorer: {
                        connect: {
                           userId: scorerId
                        }
                    },
                    score: {
                        connect: {
                            gameRoomId: gameRoomId
                        }
                    }
                }
            });
            return score
        }
    }
}
