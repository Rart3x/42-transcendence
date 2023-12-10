import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { GameRoom, Prisma, Score } from '@prisma/client';
import { last } from 'rxjs';

@Injectable()
export class GameRoomService {
  constructor (private prisma: PrismaService) {}

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

  async getLastGameRoomIfAfk(userId: number) : Promise<GameRoom | null>{
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
    return null;
  }

  async deleteGameRoomByGameRoomId(roomId: number){
    return await this.prisma.gameRoom.delete({
      where: {
        id: roomId
      }
    })
  }
}

