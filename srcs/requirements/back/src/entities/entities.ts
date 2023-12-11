import Player  from './player';
import Wall  from './wall';
import Ball  from './ball';
import RotatingWall from './rotatingWall';

export default class Entities {
    ball: Ball;
    walls: Wall[] = []
    players : Player[] = []
    obstacles: RotatingWall[] = [];

    constructor(customGame: Boolean, player1SocketId: string, player2SocketId: string){

        this.players.push(new Player(50, 400, 10, 80, player1SocketId, "player1"));
        this.players.push(new Player(950, 400, 10, 80, player2SocketId, "player2"));

        if (customGame){
            this.obstacles.push(new RotatingWall(500, 250, 10, 120));
            this.obstacles.push(new RotatingWall(500, 650, 10, 120));
        }

        this.walls.push(new Wall(10, 400, 10, 770, "left"));
        this.walls.push(new Wall(990, 400, 10, 770, "right"));
        this.walls.push(new Wall(500, 10, 970, 10, "up"));
        this.walls.push(new Wall(500, 790, 970, 10, "down"));

        
        this.ball = new Ball(500, 400);
    }
}
