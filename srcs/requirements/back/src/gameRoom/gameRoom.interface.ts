import { User } from '../user/user.interface';
import { Score } from '../score/score.interface';

import {
    Engine,
    World
} from 'matter-js';

import Entities  from '../entities/entities';

export interface GameRoom {
    roomId: number;
    player1UserId: number,
    player2UserId: number,
    player1SocketId: string;
    player2SocketId: string;
    player1Ready: boolean;
    player2Ready: boolean;
    player1Disconnected: boolean;
    player2Disconnected: boolean;
    customGame: boolean;
    botGame: boolean;
    world: World | null;
    engine: Engine | null ;
    entities: Entities | null;
    nbBounces: number;
    scoreActual: Map<string, number>;
    score: Score[];
    running: boolean;
    started: boolean;
    paused: boolean;
    finish: boolean;
    startDate: Date;
    endDate: Date | null;
}
