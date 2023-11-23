import { User } from '../user/user.interface';
import { GameRoom } from './gameRoom.interface';

import {
   Engine,
   World
} from 'matter-js';

import Entities from '../entities/entities';

export type BotGameRoom = Omit<GameRoom, 'player2UserId' | 'player2SocketId' | 'player2Ready' | 'player2Disconnected'> & {
   botGame: true;
   player2UserId?: never;
   player2SocketId?: never;
   player2Ready?: never;
   player2Disconnected?: never;
 }

 export type RegularGameRoom = GameRoom & {
   botGame: false;
 }

 export type GameRoomType = BotGameRoom | RegularGameRoom;


 export function createGameRoom(gameRoomId: number, player1: any, player2: any, customGame: Boolean, botGame: Boolean): GameRoomType {
  if (botGame) {
      return {
          roomId: gameRoomId,
          player1UserId: player1[0],
          player1SocketId: player1[1],
          player1Ready: false,
          player1Disconnected: false,
          customGame: false,
          botGame: true,
          world: null,
          engine: null,
          entities: null,
          nbBounces: 0,
          score: new Map<string, number>(),
          running: false,
          started: false,
          paused: false,
          finish: false,
          startDate: new Date(),
          endDate: null
      } as BotGameRoom;
  } else {
      return {
          roomId: gameRoomId,
          player1UserId: player1[0],
          player2UserId: player2[0],
          player1SocketId: player1[1],
          player2SocketId: player2[1],
          player1Ready: false,
          player2Ready: false,
          player1Disconnected: false,
          player2Disconnected: false,
          customGame: customGame,
          botGame: false,
          world: null,
          engine: null,
          entities: null,
          nbBounces: 0,
          score: new Map<string, number>(),
          running: false,
          started: false,
          paused: false,
          finish: false,
          startDate: new Date(),
          endDate: null
      } as RegularGameRoom;
  }
}
