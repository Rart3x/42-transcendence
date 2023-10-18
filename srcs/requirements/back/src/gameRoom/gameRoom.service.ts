import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma } from '@prisma/client';

@Injectable()
export class GameRoomService {
  constructor (private prisma: PrismaService) {}

  async insertClientIntoGameRoom(data: Prisma.GameRoomCreateInput): Promise<GameRoom> {
    return this.prisma.gameRoom.create({
        data,
    });
  }
}

