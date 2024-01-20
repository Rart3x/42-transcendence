import Player  from './player';
import Wall  from './wall';
import Ball  from './ball';

export default class Entities {
    ball: Ball;
    walls: Wall[] = [];
    players : Player[] = [];

    constructor(customGame: Boolean, player1SocketId: string, player2SocketId: string){

        this.players.push(new Player(50, 400, 10, 80, player1SocketId, "player1"));
        this.players.push(new Player(950, 400, 10, 80, player2SocketId, "player2"));

        if (customGame){
            //Players can control a second paddle with right click on opponent side to block their shots
            this.players.push(new Player(800, 400, 10, 80, player1SocketId, "player1"));
            this.players.push(new Player(200, 400, 10, 80, player2SocketId, "player2"));
        }

        if (!customGame){
            this.walls.push(new Wall(10, 400, 10, 770, "left"));
            this.walls.push(new Wall(990, 400, 10, 770, "right"));
        }
        else{
            this.walls.push(new Wall(990, 155, 10, 300, "rightup"));
            this.walls.push(new Wall(1000, 410, 10, 200, "rightmid"));
            this.walls.push(new Wall(990, 645, 10, 300, "rightdown"));

            this.walls.push(new Wall(10, 155, 10, 300, "leftup"));
            this.walls.push(new Wall(0, 410, 10, 200, "leftmid"));
            this.walls.push(new Wall(10, 645, 10, 300, "leftdown"));
        }
        this.walls.push(new Wall(500, 10, 970, 10, "up"));
        this.walls.push(new Wall(500, 790, 970, 10, "down"));

        this.ball = new Ball(500, 400);
    }
}
