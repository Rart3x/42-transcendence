import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma, Score } from '@prisma/client';
import { UserScoreService } from '../userScore/userScore.service';

@Injectable()
export class ScoreService {
  constructor (
    private prisma: PrismaService,
    private readonly UserScoreService: UserScoreService ) {}

    async addUserScore(
        gameRoomId: number,
        scorerId: number,
        scoreIdPlayer1: number,
        scoreIdPlayer2: number) : Promise<Score>{

        var userScore = await this.UserScoreService.createUserScore(scorerId, scoreIdPlayer1, scoreIdPlayer2);
        return await this.prisma.score.update({
            where: { gameRoomId: gameRoomId },
            data: {
                score:{
                    connect: {
                        id: userScore.id
                    }
                }
            }
        });
    }

    async updateGameRoomScore(
        gameRoomId: number,
        scorerId: number,
        scoreIdPlayer1: number,
        scoreIdPlayer2: number
        ): Promise<Score> {

        const score = this.prisma.score.findFirst({
            where: { gameRoomId: gameRoomId }
        })
        if (!score){
            try {
                return await this.prisma.score.create({
                    data: {
                        gameRoomId: gameRoomId
                    }
                });
            } catch(error){
                console.log(error);
                throw error;
            }
        }
        else{
            this.addUserScore(gameRoomId, scorerId, scoreIdPlayer1, scoreIdPlayer2)
        }
    }
}
