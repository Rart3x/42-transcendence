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

        this.players.push(new Player(game, 50, 400, 10, 80, player1SocketId));
        this.players.push(new Player(game, 950, 400, 10, 80, player2SocketId));

        if (customGameMode){
            this.obstacles.push(new RotatingWall(game, 500, 250, 10, 120));
        
            this.obstacles.push(new RotatingWall(game, 500, 650, 10, 120));

            this.obstacles[0].gameObject.setAngle(60);
            
            this.obstacles[1].gameObject.setAngle(240);
        }

        this.walls.push(new Wall(game, 20, 400, 10, 770));
        this.walls.push(new Wall(game, 980, 400, 10, 770));
        this.walls.push(new Wall(game, 500, 10, 970, 10));
        this.walls.push(new Wall(game, 500, 790, 970, 10));

        this.ball = new Ball(game, 500, 400);
    }
}
