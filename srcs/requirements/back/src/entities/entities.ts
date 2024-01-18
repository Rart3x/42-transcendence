import Player  from './player';
import Wall  from './wall';
import Ball  from './ball';
import Bonus from './bonus';
import Malus from './malus';

export default class Entities {
    ball: Ball;
    walls: Wall[] = [];
    players : Player[] = [];
    bonus: Bonus[] = [];
    malus: Malus[] = [];
    lastBonusOrMalusDate: number = 0;
    bonusOrMalusActivated: boolean = false;
    bonusActivated: Boolean = false;
    malusActivated: Boolean = false;
    bonusType: string = "";

    constructor(customGame: Boolean, player1SocketId: string, player2SocketId: string){

        this.players.push(new Player(50, 400, 10, 80, player1SocketId, "player1"));
        this.players.push(new Player(950, 400, 10, 80, player2SocketId, "player2"));

        if (customGame){

            this.bonus.push(new Bonus("speed"));
            this.bonus.push(new Bonus("size"));

            this.malus.push(new Malus("speed"));
            this.malus.push(new Malus("size"));

            console.log(this.bonus[0].gameObject.position.x);
            console.log(this.malus[0].gameObject.position.x);
        }

        this.walls.push(new Wall(10, 400, 10, 770, "left"));
        this.walls.push(new Wall(990, 400, 10, 770, "right"));
        this.walls.push(new Wall(500, 10, 970, 10, "up"));
        this.walls.push(new Wall(500, 790, 970, 10, "down"));

        this.ball = new Ball(500, 400);
    }
}
