import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
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
    if (gameRoom)
      return (gameRoom);
    return null
  }

  @Post('createGameRoomInvitation/:hostPlayerName/:invitedPlayerName')
  async createGameRoomInvitation(@Body() data : { hostPlayerName: string, invitedPlayerName: string }): Promise<GameRoom> {
    const gameRoom = await this.gameRoomService.createGameRoomInvitation(data.hostPlayerName, data.invitedPlayerName);
    return (gameRoom);
  }

  @Delete('deleteGameRoom/:gameRoomId')
  async deleteGameRoomById(@Param('gameRoomId') gameRoomId: number) : Promise<GameRoom>{
    return await this.gameRoomService.deleteGameRoomByGameRoomId(gameRoomId);
  }
}
