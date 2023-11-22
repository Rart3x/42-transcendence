import Player  from './player';
import Wall  from './wall';
import Ball  from './ball';
import RotatingWall from './rotatingWall';

export default class Entities {
    ball: Ball;
    walls: Wall[] = [];
    obstacles: RotatingWall[] = [];
    players : Player[] = [];

    constructor(game: Phaser.Scene, customGameMode: boolean, player1SocketId: string, player2SocketId: string){

        this.players.push(new Player(game, 70, 400, 10, 80, player1SocketId));
        this.players.push(new Player(game, 930, 400, 10, 80, player2SocketId));

        if (customGameMode){
            this.obstacles.push(new RotatingWall(game, 500, 250, 10, 80));
            this.obstacles.push(new RotatingWall(game, 500, 650, 10, 80));
        }
        this.walls.push(new Wall(game, 30, 400, 10, 770));
        this.walls.push(new Wall(game, 970, 400, 10, 770));
        this.walls.push(new Wall(game, 500, 10, 950, 10));
        this.walls.push(new Wall(game, 500, 790, 950, 10));

        this.ball = new Ball(game, 500, 400);
    }
}
