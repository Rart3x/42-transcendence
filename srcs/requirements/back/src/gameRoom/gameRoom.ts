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
          inCooldown: false,
          insideLobby: true,
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
          player1AfkUse: false,
          player2AfkUse: false,
          playAgain: true,
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