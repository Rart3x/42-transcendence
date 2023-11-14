import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { GameRoom } from '@prisma/client';
import { GameRoomService } from './gameRoom.service';
import { Prisma } from '@prisma/client';

@Controller('gameroom')
export class GameRoomController {
  constructor(private readonly gameRoomService: GameRoomService) {}

  @Post()
  async insertClientIntoGameRoom(@Body() data: Prisma.GameRoomCreateInput): Promise<GameRoom> {
      return this.gameRoomService.createGameRoom(0, 1);
  }

  @Get('id/:id')
  async getGameRoomByRoomId(@Param('id') id: number): Promise<GameRoom> {
    const gameRoom = await this.gameRoomService.getGameRoomById(id);
    return (gameRoom);
  }
}
