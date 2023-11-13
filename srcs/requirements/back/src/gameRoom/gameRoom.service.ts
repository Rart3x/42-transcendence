import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma } from '@prisma/client';
import { Score } from '../score/score.interface';

@Injectable()
export class GameRoomService {
  constructor (private prisma: PrismaService) {}

  async createGameRoom(player1: any, player2: any): Promise<GameRoom> {
    const createdGameRoom = await this.prisma.gameRoom.create({
      data: {
        player1SocketId: player1[1],
        player2SocketId: player2[1],
        startDate: new Date(),
        users: {
          connect: [
            { userId: player1[0] },
            { userId: player2[0] },
          ],
        }
      },
    });
    return createdGameRoom;
  } 

  async updateGameRoom(gameRoomId: number, player1SocketId: string, player2SocketId: string, score: Score[]): Promise<GameRoom> {
    const scoreJson = JSON.stringify(score);
  
    return await this.prisma.gameRoom.update({
      where: {
        id: gameRoomId,
      },
      data: {
        player1SocketId: player1SocketId,
        player2SocketId: player2SocketId,
        score: scoreJson,
      },
    });
  }
}
