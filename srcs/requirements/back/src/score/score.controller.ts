import { Param, Controller, Get} from '@nestjs/common';
import { UserScore, Score} from '@prisma/client';
import { Prisma } from '@prisma/client';
import { ScoreService } from './score.service';

@Controller('score')
export class ScoreController {
  constructor(
    private readonly ScoreService: ScoreService) {}

  @Get('getAllUserScore/:gameRoomId')
  async getAllScore(@Param('gameRoomId') gameRoomId: string): Promise<UserScore[]> {
    return await this.ScoreService.getAllUserScore(gameRoomId);
  }

  @Get('getScoreByRoomId/:gameRoomId')
  async getScoreByRoomId(@Param('gameRoomId') gameRoomId: string): Promise<Score> {
    return await this.ScoreService.getScoreByRoomId(gameRoomId);
  }

  @Get('getGameWinner/:gameRoomId')
  async getGameWinner(@Param('gameRoomId') gameRoomId: string): Promise<Score> {
    return await this.ScoreService.getGameWinner(gameRoomId);
  }
}
