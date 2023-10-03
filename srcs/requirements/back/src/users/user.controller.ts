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
  Req,
} from '@nestjs/common';

import { Request } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('user')
  async signupUser(
    @Body() userData: any,
  ): Promise<User> {
    return this.userService.createUser(userData);
  }
}