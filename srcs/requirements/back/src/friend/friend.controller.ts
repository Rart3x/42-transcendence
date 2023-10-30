import { Controller, Post, Param, NotFoundException } from '@nestjs/common';
import { Friend } from '@prisma/client';
import { FriendService } from './friend.service';
import { UserService } from '../user/user.service';

@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService, private userService: UserService) {}
  }
