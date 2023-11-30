import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma, Score, UserScore } from '@prisma/client';

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

    async setWinner(
        gameRoomId: number,
        winnerId: number) : Promise<Score> {
        return await this.prisma.score.update({
            where: { gameRoomId: gameRoomId },
            data: { 
                winner: {
                    connect:{
                        userId: winnerId
                    }
                }
            }
        })
    }

    async getAllUserScore(gameRoomId: string) : Promise<UserScore[]>
    {
        var id = Number(gameRoomId);
        return await this.prisma.userScore.findMany({
            where: {
                scoreId: id
            }
        })
    }

    async getGameWinner(gameRoomId: string) : Promise<Score>
    {
        var id = Number(gameRoomId);
        return await this.prisma.score.findFirst({
            where: {
                gameRoomId: id
            },
            include: {
                winner: true
            }
        })
    }}
