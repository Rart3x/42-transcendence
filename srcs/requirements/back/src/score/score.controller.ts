import { Param, Controller, Get} from '@nestjs/common';
import { UserScore } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { ScoreService } from './score.service';

@Controller('score')
export class ScoreController {
  constructor(
    private readonly ScoreService: ScoreService) {}

  @Get('getAllScore/:gameRoomId')
  async getAllScore(@Param('gameRoomId') gameRoomId: string): Promise<UserScore[]> {
    return await this.ScoreService.getAllUserScore(gameRoomId);
  }
}
