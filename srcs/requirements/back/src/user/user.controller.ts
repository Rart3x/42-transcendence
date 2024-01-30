import { Body, Delete, Controller, UploadedFile, Get, Param, Post, UseInterceptors, Query, HttpException, HttpStatus } from '@nestjs/common';
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
  async getAllChannelsFromUser(@Param('userName') userName: string): Promise<Channel[]> | null {
    const user = await this.userService.getUserByName(userName);
    if (!user)
      return null;
    return this.userService.getAllChannelsFromUser(user.userName);
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

  @Delete('delete/:userName')
  async deleteUser(@Param('userName') userName: string): Promise<{ success: boolean }> {
    const result = await this.userService.deleteUser(userName);
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
  @Post(':userName/block/:blockedUserName')
  async blockUser(@Body('userName') userName: string, @Body('blockedUserName') blockedUserName: string): Promise<{ success: boolean }> {
    const result = await this.userService.blockUser(userName, blockedUserName);
    return { success: result };
  }


  @Get('getSocket/:userId')
  async getSocketByUserId(@Param('userId') userId: number) : Promise<string> {
    const result = await this.userService.getSocket(userId);
    return result;
  }

  @Get(':userName/isBlock/:blockedUserName')
  async isBlock(@Param('userName') userName: string, @Param('blockedUserName') blockedUserName: string): Promise<{ success: boolean }> {
    const result = await this.userService.isBlock(userName, blockedUserName);
    return { success: result };
  }

  @Get(':userName/isBlocked/:blockedUserName')
  async isBlocked(@Param('userName') userName: string, @Param('blockedUserName') blockedUserName: string): Promise<{ success: boolean }> {
    const result = await this.userService.isBlocked(userName, blockedUserName);
    return { success: result };
  }

  @Post(':userName/setStatus')
  async setStatus(@Body('userName') userName: string, @Body('status') status: string): Promise<{ success: boolean }> {
    const result = await this.userService.setStatus(userName, status);
    return { success: result };
  }

  @Post(':userName/unblock/:unblockedUserName')
  async unblockUser(@Body('userName') userName: string, @Body('unblockedUserName') unblockedUserName: string): Promise<{ success: boolean }> {
    const result = await this.userService.unblockUser(userName, unblockedUserName);
    return { success: result };
  }

  @Post('updateUsername/:userName')
  async updateUsername(@Body('userName') userName: string, @Body('newUserName') newUserName: string): Promise<User> {
    
    const user = await this.userService.getUserByName(userName);

    if (user)
      await this.userService.updateUserName(user.userId, newUserName); 
    return user;
  }

  @Get('getUsername/:userName')
  async getUserByName(@Param('userName') userName: string): Promise<User> {
    return await this.userService.getUserByName(userName);
  }

  @Get('getUserByDisplayName/:displayName')
  async getUserByDisplayName(@Param('displayName') displayName: string): Promise<User> {
    return await this.userService.getUserByDisplayName(displayName);
  }

  @Get('getUser/:userId')
  async getUserById(@Param('userId') userId: number): Promise<User> {
   try {
     return await this.userService.getUserById(userId);
   } catch (e) {
     if (e.message === 'User not found')
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
     throw e;
   }
  }

  @Get('getAllUsers/')
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

/*-----------------------------------------------UTILS-----------------------------------------------*/
  @Get('checkA2F/:userName')
  async checkA2F(@Param('userName') userName: string, @Query('token') token: string): Promise<boolean> {
    const user = await this.userService.getUserByName(userName);
    if (!user)
      console.warn("error: user not found");
    const checkVal = authenticator.check(token, user.A2FSecret);
    if (checkVal){
      console.log(`User ${user.userName} has logged in`)
      await this.userService.updateStatus(user.userId, "online");
      await this.userService.setA2FValid(user.userName);
    }
    return checkVal;
  }

  @Post('setA2FValid/:userName')
  async setA2FValid(@Body('userName') userName: string): Promise<User> {
    const user = await this.userService.setA2FValid(userName);
    if (!user)
      console.warn("error: user not found");
    return user;
  }

  @Post('setA2FInvalid/:userName')
  async setA2FInvalid(@Body('userName') userName: string): Promise<User> {
    console.log(`inside the controller of setA2FInvalid ${userName}`)
    const user = await this.userService.setA2FInvalid(userName);
    if (!user)
      console.warn("error: user not found");
    return user;
  }


  @Post('updateA2F/:userName')
  async updateA2F(@Body('userName') userName: string, @Body('A2F') A2F: boolean): Promise<User> {
    const user = await this.userService.updateA2F(userName, A2F);
    if (!user)
      console.warn("error: user not found");
    return user;
  }

  @Post('socket/:socket')
  async setSocket(@Body('userName') userName: string, @Body('socket') socket: string): Promise<User> {
    const user = await this.userService.getUserByName(userName);

    try {
      return await this.userService.setSocket(user.userId, socket);
    } catch (error) {
      console.warn('Error in setSocket:', error);
    }
    return user
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
