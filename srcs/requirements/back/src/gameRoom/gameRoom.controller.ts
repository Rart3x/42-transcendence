import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameRoom } from '@prisma/client';
import { gameRoomService } from './queueList.service';
import { Prisma } from '@prisma/client';

@Controller('gameroom')
export class gameRoomController {
  constructor(private readonly gameRoomService: gameRoomService) {}

  @Post()
  async insertClientIntoGameRoom(@Body() data: Prisma.gameRoomCreateInput): Promise<GameRoom> {
      return this.gameRoomService.insertClientIntoGameRoom(data);
  }
}

