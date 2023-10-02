import { AppService } from '../services/app.service';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { User as UserModel, Post as PostModel } from '@prisma/client';
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
    private readonly postService: PostService,
  ) {}

  @Post('user')
  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}