import { BadRequestException, Body, Delete, Controller, UploadedFile, Get, Param, Post, UseInterceptors, Query} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PartialUserDTO } from './dto/partial-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Channel, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UserService } from './user.service';
import { validateOrReject } from 'class-validator';
import { authenticator } from 'otplib';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly prisma: PrismaService) {}

/*-----------------------------------------------CHANNELS-----------------------------------------------*/
  @Get(':userName/channels')
  async getAllChannels(@Param('userName') userName: string): Promise<Channel[]> | null {
    const user = await this.userService.getUserByName(userName);
    
    if (!user) {
      return null;
    }
    return this.userService.getAllChannels(user.userName);
  }

/*-----------------------------------------------FRIENDS-----------------------------------------------*/
  @Post('friend/add/:userName')
  async createFriend(@Body('userName') userName: string, @Body('friendName') friendName: string): Promise<{ success: boolean }> {
    const result = await this.userService.addFriend(userName, friendName);
    return { success: result };
  }

  @Delete('friend/delete/:userName')
  async deleteFriend(@Body('userName') userName: string, @Body('friendName') friendName: string): Promise<{ success: boolean }> {
    const result = await this.userService.removeFriend(userName, friendName);
    return { success: result };
  }

  @Get('isFriend/:userName/:friendName')
  async isFriend(@Param('userName') userName: string, @Param('friendName') friendName: string): Promise<{ success: boolean }> {
    const result =  await this.userService.isFriend(userName, friendName);
    return { success: result };
  }

  @Get(':userName/friends')
  async getAllFriends(@Param('userName') userName: string): Promise<User[]> {
  const user = await this.userService.getUserByName(userName);

  if (!user) {
    console.warn("error: user not found");
    return null;
  }
  return this.userService.getAllFriends(user.userId);
}

/*-----------------------------------------------USERS-----------------------------------------------*/
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
    
    const user = await this.userService.getUserByName(userName);

    if (user) {
      await this.userService.updateUserName(user.userId, newUserName); 
    }
    else{
      console.warn("error: user not found");
    }
    return user;
  }

  @Get('getUsername/:userName')
  async getUserByName(@Param('userName') userName: string): Promise<User> {
    return await this.userService.getUserByName(userName);
  }

  @Get('getAllUsers/')
  async getAllUsers(): Promise<PartialUserDTO[]> {
    return await this.userService.getAllUsers();
  }

/*-----------------------------------------------UTILS-----------------------------------------------*/
  @Get('checkA2F/:userName')
  async checkA2F(@Param('userName') userName: string, @Query('token') token: string): Promise<boolean> {
    const user = await this.userService.getUserByName(userName);
    if (!user) {
      console.warn("error: user not found");
    }
    return authenticator.check(token, user.A2FSecret);
  }

  @Get('cookie/:cookie')
  async getUserByCookie(@Param('cookie') cookie: string): Promise<User> {

    const user = await this.userService.getUserByCookie(cookie);

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
    const user = await this.userService.getUserByName(userName);

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
    
    const user = await this.userService.getUserByName(userName);
    
    if (user) {
      await this.userService.updateCookie(user.userId, cookie); 
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
}
