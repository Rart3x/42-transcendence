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
    player2SocketId: string | undefined;
    player1UserName: string;
    player2UserName: string | undefined;
    player1UserId: number;
    player2UserId: number;
    player1Ready: boolean;
    player2Ready: boolean;
    player1PlayAgain: boolean;
    player2PlayAgain: boolean;
    player1Disconnected: boolean;
    player2Disconnected: boolean;
    player1AfkUse: boolean;
    player2AfkUse: boolean;
    finish: boolean;

    world?: World | null;
    engine?: Engine | null;
    entities?: Entities | null;
    score?: Map<string, number>;
    running?: Boolean;
    playAgain: Boolean;
    constructor(
        game: Phaser.Scene,
        roomId: number,
        customGameMode: boolean,
        socketPlayer1: string,
        socketPlayer2: string,
        player1UserId: number,
        player2UserId: number,
        player1UserName: string,
        player2UserName: string,
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
            this.player1Ready = false;
            this.player2Ready = false;
            this.player1Disconnected = false;
            this.player2Disconnected = false;
            this.engine = null;
            this.world = null;
            this.entities = null;
            this.running = false;
            this.playAgain = true;
            this.finish = false;
            this.player1AfkUse = false;
            this.player2AfkUse = false;
            this.score = new Map<string, number>();
            this.score.set(socketPlayer1, 0);
            this.score.set(socketPlayer2, 0);
        }


    static createGameRoom(
        game: Phaser.Scene,
        roomId: number,
        customGameMode: boolean,
        socketPlayer1: string,
        socketPlayer2: string,
        player1UserId: number,
        player2UserId: number,
        player1UserName: string, 
        player2UserName: string): GameRoom {
 
        return new GameRoom(game, roomId, customGameMode, socketPlayer1, socketPlayer2, player1UserId, player2UserId, player1UserName, player2UserName, false);
    }
}
