import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { validateOrReject } from 'class-validator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    try {
      // Datas are not valid if it throw an exception
      await validateOrReject(createUserDTO);

      return this.userService.createUser(createUserDTO);
    }
    catch (validationErrors) {
      throw new BadRequestException(validationErrors);
    }
  }
}
