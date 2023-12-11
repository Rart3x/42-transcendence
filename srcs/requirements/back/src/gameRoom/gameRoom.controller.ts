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

  @Get('getPastGameRooms/:userId')
  async getPastGameRoomByUserId(@Param('userId') userId: number): Promise<GameRoom[]> {
    const gameRoom = await this.gameRoomService.getGameRoomsByUserId(userId);
    return (gameRoom);
  }

  @Get('getCurrentGameRoom/:userId')
  async getCurrentGameRoomByUserId(@Param('userId') userId: number): Promise<GameRoom> {
    const gameRoom = await this.gameRoomService.getCurrentGameRoomByUserId(userId);
    return (gameRoom);
  }

  @Get('getLastGameRoomIfAfk/:userId')
  async getLastGameRoomIfAfk(@Param('userId') userId: number): Promise<GameRoom> {
    const gameRoom = await this.gameRoomService.getLastGameRoomIfAfk(userId);
    return (gameRoom);
  }

  @Post('createGameRoomInvitation/:hostName')
  async createGameRoomInvitation(@Param('userId') hostName: string): Promise<GameRoom> {
    const gameRoom = await this.gameRoomService.createGameRoomInvitation(hostName);
    return (gameRoom);
  }
}
