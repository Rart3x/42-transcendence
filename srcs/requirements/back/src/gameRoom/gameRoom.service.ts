import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma, Score } from '@prisma/client';
import { last } from 'rxjs';
import { UserService } from '../user/user.service';
import e from 'express';
import { getAdapter } from 'axios';

@Injectable()
export class GameRoomService {
  constructor (
    private prisma: PrismaService,
    private readonly UserService: UserService) {}
  
  async createGameRoom(
    player1: any,
    player2: any | undefined,
    isCustomGame: boolean): Promise<GameRoom> {
      return await this.prisma.gameRoom.create({
        data: {
          player1SocketId: player1[1],
          player2SocketId: player2[1],
          player1UserId: player1[0],
          player2UserId: player2[0],
          customGame: isCustomGame,
          startDate: new Date(),
          users: {
            connect: [
              { userId: player1[0] },
              { userId: player2[0] },
            ],
          }
        },
      });
  }

  async createGameRoomInvitation(hostPlayerName: string, invitedPlayerName: string): Promise<GameRoom> {
    var hostPlayer = await this.UserService.getUserByName(hostPlayerName);
    var invitedPlayer = await this.UserService.getUserByName(invitedPlayerName);
    return await this.prisma.gameRoom.create({
        data: {
          player1SocketId: hostPlayer.socket,
          player2SocketId: invitedPlayer.socket,
          player1UserId: hostPlayer.userId,
          player2UserId: invitedPlayer.userId,
          customGame: false,
          startDate: new Date(),
          users: {
            connect: [
              { userId: hostPlayer.userId },
              { userId: invitedPlayer.userId },
            ],
          }
        },
    });
  }

  async updateGameRoom(
    gameRoomId: number,
    player1SocketId: string,
    player2SocketId: string,
    player1Afk: boolean,
    player2Afk: boolean,
    nbBounces: number): Promise<GameRoom> {
    
    return await this.prisma.gameRoom.update({
      where: {
        id: gameRoomId,
      },
      data: {
        player1SocketId: player1SocketId,
        player2SocketId: player2SocketId,
        player1Afk: player1Afk,
        player2Afk: player2Afk,
        running: false,
        endDate: new Date(),
        nbBounces: nbBounces,
      },
    });
  }

  async setRunning(gameRoomId: number){
    return await this.prisma.gameRoom.update({
      where: {
        id: gameRoomId,
      },
      data: {
        running: true,
      },
    });
  }

  async getGameRoomById(id: number) {
    return await this.prisma.gameRoom.findUnique({
      where: { id: id - 0 },
      include : {
        users: true,
        score: true
      }
    });
  }

  async getGameRoomsByUserId(userId: number) {
    const id = typeof userId === 'string' ? parseInt(userId) : userId;

    return await this.prisma.gameRoom.findMany({
      where: {
        users: {
          some: {
            userId: id,
          },
        },
        running: false
      },
      include : {
        users: true,
        score: true,
      },
    });
  }

  async getCurrentGameRoomByUserId(userId: number){
    const id = typeof userId === 'string' ? parseInt(userId) : userId;

    return await this.prisma.gameRoom.findFirst({
      orderBy: {
        startDate: 'desc',
      },
      where: {
        users: {
          some: {
            userId: id,
          },
        },
        running: true
      },
      include : {
        users: true,
        score: true,
      },
    });
  }

  async getLastGameRoomIfAfk(userId: number) : Promise<GameRoom | undefined>{
    const id = typeof userId === 'string' ? parseInt(userId) : userId;

    var lastActiveGameRoom =  await this.prisma.gameRoom.findFirst({
      orderBy: {
        startDate: 'desc',
      },
      where: {
        users: {
          some: {
            userId: id,
          },
        }
      },
      include: {
        users: true,
      }
    });
    if (lastActiveGameRoom){
      if (lastActiveGameRoom.player1UserId == userId){
        if (lastActiveGameRoom.player1Afk && !lastActiveGameRoom.player1Reconnected){
          //Only if the player didnt reconnected to the game since
          return await this.prisma.gameRoom.update({
            where: {
              id: lastActiveGameRoom.id,
            },
            data: {
              player1Reconnected: true,
            },
            include: {
              users: true,
            }
          });
        }
      }
      else if (lastActiveGameRoom.player2UserId == userId){
        if (lastActiveGameRoom.player2Afk && !lastActiveGameRoom.player2Reconnected){
          lastActiveGameRoom.player2Reconnected == true;
          return await this.prisma.gameRoom.update({
            where: {
              id: lastActiveGameRoom.id,
            },
            data: {
              player2Reconnected: true,
            },
            include: {
              users: true,
            }
          });
        }
      }
    }
    return undefined;
  }

  async deleteGameRoomByGameRoomId(gameRoomId: number){
    var id = Number(gameRoomId); 
    return await this.prisma.gameRoom.delete({
      where: {
        id: id
      }
    })
  }
}
