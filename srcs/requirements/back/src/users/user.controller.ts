import { UserService } from './user.service';
import { User } from '@prisma/client';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('user')
  async signupUser(
    @Body() userData: { userName?: string; userPass: string },
  ): Promise<User> {
    return this.userService.createUser(userData);
  }
}