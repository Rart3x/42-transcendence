import * as Matter from 'matter-js'

import {
    Engine,
    World
} from 'matter-js';

import Entities  from '../entities/entities';

export default class GameRoom {
    id?: number;
    player1SocketId: string;
    player2SocketId: string;
    player1PlayAgain: boolean;
    player2PlayAgain: boolean;
    world?: World | null;
    engine?: Engine | null;
    entities?: Entities | null;
    score?: Map<string, number>;
    running?: Boolean;

    constructor(game: Phaser.Scene, roomId: number, socketPlayer1: string, socketPlayer2: string){
        this.id = roomId;
        this.player1SocketId = socketPlayer1;
        this.player2SocketId = socketPlayer2;
        player1PlayAgain: false;
        player2PlayAgain: false;
        this.engine = null;
        this.world = null;
        this.entities = null;
        this.running = false;
        this.score = new Map<string, number>();
        this.score.set(socketPlayer1, 0);
        this.score.set(socketPlayer2, 0);
    }
}
