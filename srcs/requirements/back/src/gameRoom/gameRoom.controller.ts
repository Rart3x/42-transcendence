import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { GameRoom } from '@prisma/client';
import { GameRoomService } from './gameRoom.service';
import { Prisma } from '@prisma/client';

@Controller('gameroom')
export class GameRoomController {
  constructor(private readonly gameRoomService: GameRoomService) {}

  @Get('id/:id')
  async getGameRoomByRoomId(@Param('id') id: number): Promise<GameRoom> {
    const gameRoom = await this.gameRoomService.getGameRoomById(id);
    return (gameRoom);
  }

  @Get('get/:userId')
  async getGameRoomByUserId(@Param('userId') userId: number): Promise<GameRoom[]> {
    const gameRoom = await this.gameRoomService.getGameRoomByUserId(userId);
    return (gameRoom);
  }
}
