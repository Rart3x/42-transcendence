import { Controller, Get, Post, Body } from '@nestjs/common';
// import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';

@Controller('User')
export class UserController {
  constructor(private userService: UserService) {}

  // @Post()
  // async create(@Body() createUserDto: CreateUserDto) {
  //   this.userService.create(createUserDto);
  // }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}