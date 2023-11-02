import { BadRequestException, Body, Delete, Controller, UploadedFile, Get, Param, Post, UseInterceptors} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UserService } from './user.service';
import { validateOrReject } from 'class-validator';
import { authenticator } from 'otplib';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly prisma: PrismaService) {}

  @Post('friend/:userName')
  async createFriend(@Param('userName') userName: string, @Param('friendName') friendName: string): Promise<User | null> {
    try {
      const user = await this.userService.addFriend(userName, friendName);
      const friend = await this.userService.addFriend(friendName, userName);

      return friend;
    }
    catch (error) {
      console.error("Error adding friend:", error);
      return null;
    }
  }

  // @Delete('friend/:userName')
  // async deleteFriend(@Param('userName') userName: string, @Body('friendName') friendName: string): Promise<User> {
  //   const user = await this.userService.getUserByUserName(userName);
  //   const friend = await this.userService.getUserByUserName(friendName);

  //   if (!user || !friend) {
  //     console.warn("error: user or friend not found");
  //     return null;
  //   }
  
  //   const updatedUser = this.userService.removeFriend(user, friend);
  //   return updatedUser;
  // }

  @Get('friends/:userName')
  async getAllFriends(@Param('userName') userName: string): Promise<User[]> {
  const user = await this.userService.getUserByUserName(userName);

  if (!user) {
    console.warn("error: user not found");
    return null;
  }

  return this.userService.getAllFriends(user.userId);
}

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

  @Post('updateUsername/:userName')
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

  @Post('updateImage/:userName')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(@Param('userName') userName: string, @UploadedFile() image): Promise<User> {
    
    const user = await this.userService.updateImage(userName, image);
    if (!user) {
      console.warn("error: user not found");
    }
    return user;
  }

  @Post('updateA2F/:userName')
  async updateA2F(@Body('userName') userName: string, @Body('A2F') A2F: boolean): Promise<User> {
    
    const user = await this.userService.updateA2F(userName, A2F);
    if (!user) {
      console.warn("error: user not found");
    }
    return user;
  }

  @Post('socket/:socket')
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

  @Post('updateCookie/:cookie')
  async updateCookie(@Body('userName') userName: string, @Body('cookie') cookie: string): Promise<User> {
    
    const user = await this.userService.getUserByUserName(userName);
    
    if (user) {
      await this.userService.updateCookie(user.userId, cookie); 
    }
    else{
      console.warn("error: user not found");
    }
    return user;
  }

  @Get('getUsername/:userName')
  async getUserByUserName(@Param('userName') userName: string): Promise<User> {
    return await this.userService.getUserByUserName(userName);
  }

  @Get('cookie/:cookie')
  async getUserByCookie(@Param('cookie') cookie: string): Promise<User> {

    const user = await this.userService.getUserByCookie(cookie);

    return user;
  }

  @Get('checkA2F/:userName')
  async checkA2F(@Body('userName') userName: string, @Body('token') token: string): Promise<boolean> {
    const user = await this.userService.getUserByUserName(userName);
    console.log(`Calling checkA2F with userId: ${user.userId} and token: ${token}`);
    if (!user) {
      console.warn("error: user not found");
    }
    return authenticator.check(token, user.A2FSecret);
  }

  // @Get('userId/:userId')
  // async getFriendUserNames(@Param('userId') userId: number): Promise<string[]> {
  //   return this.userService.getFriendUserNames(userId);
  // }
}
