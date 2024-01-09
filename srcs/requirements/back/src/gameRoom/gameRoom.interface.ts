import { User } from '../user/user.interface';

import {
    Engine,
    World
} from 'matter-js';

import Entities  from '../entities/entities';

export interface GameRoom {
    roomId: number;
    inCooldown: Boolean;
    player1UserId: number,
    player2UserId: number,
    player1SocketId: string;
    player2SocketId: string;
    player1Ready: boolean;
    player2Ready: boolean;
    player1Spawn: boolean;
    player2Spawn: boolean;
    player1Disconnected: boolean;
    player2Disconnected: boolean;
    player1AfkUse: boolean;
    player2AfkUse: boolean;
    playAgain: boolean;
    customGame: boolean;
    world: World | null;
    engine: Engine | null ;
    entities: Entities | null;
    nbBounces: number;
    score: Map<string, number>;
    running: boolean;
    started: boolean;
    paused: boolean;
    pausedAfk: boolean;
    finish: boolean;
    startDate: Date;
    endDate: Date | null;
    winnerId?: number;
}
