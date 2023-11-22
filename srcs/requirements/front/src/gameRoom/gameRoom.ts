import * as Matter from 'matter-js'

import {
    Engine,
    World
} from 'matter-js';

import Entities  from '../entities/entities';

export default class GameRoom {
    id: number;
    customGameMode: boolean;
    player1SocketId: string;
    player1UserName: string;
    player2UserName: string | undefined;
    player1UserId: number;
    player1PlayAgain: boolean;
    player2SocketId: string | undefined;
    player1Disconnected: boolean;
    player2UserId: number;
    player2PlayAgain: boolean;
    player2Disconnected: boolean;

    world?: World | null;
    engine?: Engine | null;
    entities?: Entities | null;
    score?: Map<string, number>;
    running?: Boolean;

    constructor(
        game: Phaser.Scene,
        roomId: number,
        customGameMode: boolean,
        socketPlayer1: string,
        player1UserId: number,
        player1UserName: string,
        socketPlayer2: string,
        player2UserId: number,
        player2UserName: string,
        botGame: boolean = false
      ) {
            this.id = roomId;
            this.customGameMode = customGameMode;
            this.player1SocketId = socketPlayer1;
            this.player2SocketId = socketPlayer2;
            this.player1UserName = player1UserName;
            this.player2UserName = player2UserName;
            this.player1UserId = player1UserId;
            this.player2UserId = player2UserId;
            this.player1PlayAgain = false;
            this.player2PlayAgain = false;
            this.player1Disconnected = false;
            this.player2Disconnected = false;
            this.engine = null;
            this.world = null;
            this.entities = null;
            this.running = false;
            this.score = new Map<string, number>();
            this.score.set(socketPlayer1, 0);
            if (!botGame && socketPlayer2) {
                this.score.set(socketPlayer2, 0);
            }
        }

    static createBotGameRoom(
        game: Phaser.Scene,
        roomId: number,
        socketPlayer1: string,
        player1UserId: number,
        player1UserName: string): GameRoom {
        return new GameRoom(game, roomId, socketPlayer1, player1UserId, player1UserName, undefined, undefined, undefined, true);
    }

    static createRegularGameRoom(
        game: Phaser.Scene,
        roomId: number,
        customGameMode: boolean,
        socketPlayer1: string,
        socketPlayer2: string,
        player1UserId: number,
        player2UserId: number,
        player1UserName: string, 
        player2UserName: string): GameRoom {
 
        return new GameRoom(game, roomId, customGameMode, socketPlayer1, player1UserId, player1UserName, socketPlayer2, player2UserId, player2UserName, false);
    }
}
