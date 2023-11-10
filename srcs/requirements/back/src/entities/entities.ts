import Player  from './player';
import Wall  from './wall';
import Ball  from './ball';

export default class Entities {
    ball: Ball;
    walls: Wall[] = []
    players : Player[] = []

    constructor(player1SocketId: string, player2SocketId: string){

        this.players.push(new Player(60, 400, 10, 60, player1SocketId, "player1"));
        this.players.push(new Player(940, 400, 10, 60, player2SocketId, "player2"));

        this.walls.push(new Wall(20, 400, 10, 770, "left"));
        this.walls.push(new Wall(980, 400, 10, 770, "right"));
        this.walls.push(new Wall(500, 10, 970, 10, "up"));
        this.walls.push(new Wall(500, 790, 970, 10, "down"));

        this.ball = new Ball(500, 400);
        //test labels
        // console.log(this.ball.gameObject.label);
        // console.log(this.players[0].gameObject.label);
        // console.log(this.players[1].gameObject.label);
        // for (let i = 0; i < 4; i++)
        // {
        //     console.log(this.walls[i].gameObject.label);
        // }
    }
}
