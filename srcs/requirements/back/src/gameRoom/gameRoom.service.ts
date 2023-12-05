import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma, Score } from '@prisma/client';

@Injectable()
export class GameRoomService {
  constructor (private prisma: PrismaService) {}

  async createGameRoom(
    player1: any,
    player2: any | undefined,
    isCustomGame: boolean): Promise<GameRoom> {

      return  await this.prisma.gameRoom.create({
        data: {
          player1SocketId: player1[1],
          player2SocketId: player2[1],
          customGame: isCustomGame,
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

  async updateGameRoom(
    gameRoomId: number,
    player1SocketId: string,
    player2SocketId: string,
    nbBounces: number): Promise<GameRoom> {
    
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

  async getGameRoomsByUserId(userId: number) {
    const id = typeof userId === 'string' ? parseInt(userId) : userId;

    return await this.prisma.gameRoom.findMany({
      where: {
        users: {
          some: {
            userId: id,
          },
        },
        running: false
      },
      include : {
        users: true,
        score: true,
      },
    });
  }

  async getCurrentGameRoomByUserId(userId: number) {
    const id = typeof userId === 'string' ? parseInt(userId) : userId;

    return await this.prisma.gameRoom.findFirst({
      where: {
        users: {
          some: {
            userId: id,
          },
        },
        running: true
      },
      include : {
        users: true,
        score: true,
      },
    });
  }
}
