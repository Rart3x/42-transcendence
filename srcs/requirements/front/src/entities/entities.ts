import Player  from './player';
import Wall  from './wall';
import Ball  from './ball';

export default class Entities {
    ball: Ball;
    walls: Wall[] = []
    players : Player[] = []

    constructor(game: Phaser.Scene, player1SocketId: string, player2SocketId: string){

        this.players.push(new Player(game, 70, 400, 10, 80, player1SocketId));
        this.players.push(new Player(game, 930, 400, 10, 80, player2SocketId));

        this.walls.push(new Wall(game, 30, 400, 10, 770));
        this.walls.push(new Wall(game, 970, 400, 10, 770));
        this.walls.push(new Wall(game, 500, 10, 950, 10));
        this.walls.push(new Wall(game, 500, 790, 950, 10));

        this.ball = new Ball(game, 500, 400);
    }
}
