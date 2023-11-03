import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma } from '@prisma/client';

@Injectable()
export class GameRoomService {
  constructor (private prisma: PrismaService) {}

  async createGameRoom(userId1: number, userId2: number): Promise<GameRoom> {
    return await this.prisma.gameRoom.create({
      data: {
        gameRoomUsers: {
          create: [
            { userId: userId1 },
            { userId: userId2 },
          ],
        },
      },
    });
  }
}
