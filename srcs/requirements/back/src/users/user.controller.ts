import { BadRequestException, Body, Controller, Get, Param, Post} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { validateOrReject } from 'class-validator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    try {
      await validateOrReject(createUserDTO);

      return this.userService.createUser(createUserDTO);
    }
    catch (validationErrors) {
      throw new BadRequestException(validationErrors);
    }
  }

  @Post(':userName')
  async updateUsername(@Body('userName') userName: string, @Body('newUserName') newUserName: string): Promise<User> {
    
    const user = await this.userService.getUserByUserName(userName);
    
    if (user) {
      await this.userService.updateUserName(user.userId, newUserName); 
    }
    else{
      console.warn("error: user not found");
    }
    return user;
  }

  @Post('socket')
  async setSocket(@Body('userName') userName: string, @Body('socket') socket: string): Promise<User> {
    const user = await this.userService.getUserByUserName(userName);

    try {
      console.log(`Calling setSocket with userId: ${user.userId} and socket: ${socket}`);
      return await this.userService.setSocket(user.userId, socket);
    } catch (error) {
      console.warn('Error in setSocket:', error);
    }
    return user
}
  @Post(':userName/friend')
  async addFriendToUser(@Body('userName') userName: string, @Body('friendName') friendName: string): Promise<User> {
    const user = await this.userService.addFriend(userName, friendName);
  
    if (!user) {
      console.warn("error: user not found");
    }
    return user;
  }

  @Get(':userName')
  async getUserByUserName(@Param('userName') userName: string): Promise<User> {
    
    const user = await this.userService.getUserByUserName(userName);

    if (!user) {
      return this.createUser({ userName: userName });
    }
    else{
      console.warn("error: user is already register:", userName)
    }
    return user;
  }

  @Get(':userId')
  async getFriendUserNames(@Param('userId') userId: number): Promise<string[]> {
    return this.userService.getFriendUserNames(userId);
  }
}
