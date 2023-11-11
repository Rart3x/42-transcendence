import { User } from '../user/user.interface';

import {
Engine,
World
} from 'matter-js';

import Entities  from '../entities/entities';

export interface GameRoom {
    roomId: number;
    player1SocketId: string;
    player2SocketId: string;
    player1Ready: boolean;
    player2Ready: boolean;
    world: World | null;
    engine: Engine | null ;
    entities: Entities | null;
    score: Map<string, number>;
    running: Boolean;
    started: Boolean;
    paused: Boolean;
    finish: Boolean;
    startDate: Date;
    endDate: Date | null;
}
