import { User } from '../user/user.interface';
import { GameRoom } from './gameRoom.interface';

import {
   Engine,
   World
} from 'matter-js';

import Entities from '../entities/entities';

 export function createGameRoom(gameRoomId: number, player1: any, player2: any, customGame: boolean): GameRoom {
      return {
          roomId: gameRoomId,
          player1SocketId: player1[1],
          player2SocketId: player2[1],
          player1UserId: player1[0],
          player2UserId: player2[0],
          player1Ready: false,
          player2Ready: false,
          player1Disconnected: false,
          player2Disconnected: false,
          player1Spawn: false,
          player2Spawn: false,
          customGame: customGame,
          world: null,
          engine: null,
          entities: null,
          nbBounces: 0,
          score: new Map<string, number>(),
          running: false,
          started: false,
          pausedAfk: false,
          paused: false,
          finish: false,
          startDate: new Date(),
          endDate: null
      };
}
