import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma } from '@prisma/client';

@Injectable()
export class gameRoomService {
  constructor (private prisma: PrismaService) {}

  async insertGameRoom(data: Prisma.GameRoom.CreateInput): Promise<GameRoom> {
    return this.prisma.gameRoom.create({
        data,
    });
  }
}

