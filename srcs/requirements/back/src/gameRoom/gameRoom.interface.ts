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
    world: World | null;
    engine: Engine | null ;
    entities: Entities | null;
    scoreActual: Map<string, number>;
    score: Score[];
    running: Boolean;
    started: Boolean;
    paused: Boolean;
    finish: Boolean;
    startDate: Date;
    endDate: Date | null;
}
