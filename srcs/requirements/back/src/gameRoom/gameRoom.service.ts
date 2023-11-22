import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma } from '@prisma/client';
import { Score } from '../score/score.interface';

@Injectable()
export class GameRoomService {
  constructor (private prisma: PrismaService) {}

  async createGameRoom(
    player1: any,
    player2: any | undefined,
    isBotGame: boolean,
    isCustomGame: boolean): Promise<GameRoom> {

    if (isBotGame){
      return  await this.prisma.gameRoom.create({
        data: {
          player1SocketId: player1[1],
          botGame: isBotGame,
          customGame: isCustomGame,
          score : JSON.stringify([]),
          startDate: new Date(),
          users: {
            connect: [
              { userId: player1[0] },
            ],
          }
        },
      });
    }
    else{
      return  await this.prisma.gameRoom.create({
        data: {
          player1SocketId: player1[1],
          player2SocketId: player2[1],
          botGame: isBotGame,
          customGame: isCustomGame,
          score : JSON.stringify([]),
          startDate: new Date(),
          users: {
            connect: [
              { userId: player1[0] },
              { userId: player2[0] },
            ],
          }
        },
      });
    }
  }

  async updateGameRoom(
    gameRoomId: number,
    player1SocketId: string,
    player2SocketId: string,
    score: Score[],
    nbBounces: number): Promise<GameRoom> {
    const scoreJson = JSON.stringify(score);
  
    return await this.prisma.gameRoom.update({
      where: {
        id: gameRoomId,
      },
      data: {
        player1SocketId: player1SocketId,
        player2SocketId: player2SocketId,
        running: false,
        endDate: new Date(),
        nbBounces: nbBounces,
        score: scoreJson
      },
    });
  }

  async setRunning(gameRoomId: number){
    return await this.prisma.gameRoom.update({
      where: {
        id: gameRoomId,
      },
      data: {
        running: true,
      },
    });
  }

  async getGameRoomById(id: number) {
    return await this.prisma.gameRoom.findUnique({
      where: { id: id - 0 },
    });
  }

  async getGameRoomByUserId(userId: number) {
    const id = typeof userId === 'string' ? parseInt(userId) : userId;

    return await this.prisma.gameRoom.findMany({
      where: {
        users: {
          some: {
            userId: id,
          },
        },
      },
      include : {
        users: true,
      },
    });
  }
}
