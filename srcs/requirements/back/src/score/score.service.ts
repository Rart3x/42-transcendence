import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma, Score, UserScore } from '@prisma/client';

@Injectable()
export class ScoreService {
  constructor (
    private prisma: PrismaService) {}

    async updateGameRoomScore(
        gameRoomId: number,
        scorerId: number | undefined,
        scoreIdPlayer1: number,
        scoreIdPlayer2: number
        ): Promise<Score> {

        const score = await this.prisma.score.findFirst({
            where: { gameRoomId: gameRoomId }
        });

        //If win by afk no scorer
        const scorer = scorerId != undefined ? { connect: { userId: scorerId } } : {};

        const scorePayload = scorerId != undefined ? { create : { time: new Date(), scoreA: scoreIdPlayer1, scoreB: scoreIdPlayer2, scorerId: scorerId } } :
                                        { create : { time: new Date(), scoreA: scoreIdPlayer1, scoreB: scoreIdPlayer2 } };

        if (!score){
            try{
                await this.prisma.score.create({
                    data:{
                        gameRoomId: gameRoomId,
                        score: scorePayload,
                    }
                })
            }
            catch (e){
                console.log(e);
            }
        }
        else{
            await this.prisma.userScore.create({
                data: {
                    time: new Date(),
                    scoreA: scoreIdPlayer1,
                    scoreB: scoreIdPlayer2,
                    scorer,
                    score: {
                        connect: {
                            gameRoomId: gameRoomId
                        }
                    }
                }
            });
            return await this.prisma.score.findFirst({
                where: { gameRoomId: gameRoomId }
            });
        }
    }

    async setWinner(gameRoomId: number, winnerId: number) : Promise<Score | null> {
        var score = await this.prisma.score.findUnique({
            where : { gameRoomId: gameRoomId }
        });
        if (score){
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
        return null;
    }

    async setWinByAfk(gameRoomId: number) : Promise<Score | null>{
        var score = await this.prisma.score.findUnique({
            where : { gameRoomId: gameRoomId }
        });
        if (score){
            return await this.prisma.score.update({
                where : {
                    gameRoomId: gameRoomId
                },
                data : {
                    winByAfk: true
                }
            })
        }
        return null;
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

    async getScoreByRoomId(gameRoomId: string) : Promise<Score>
    {
        var roomId = Number(gameRoomId);

        return await this.prisma.score.findUnique({
            where: {
                gameRoomId: roomId
            },
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
