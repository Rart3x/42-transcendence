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

    constructor(game: Phaser.Scene, customGameMode: boolean, player1SocketId: string, player2SocketId: string){

        this.players.push(new Player(game, 50, 400, 10, 80, player1SocketId));
        this.players.push(new Player(game, 950, 400, 10, 80, player2SocketId));

        if (customGameMode){

            this.bonus.push(new Bonus(game, "speedBonus"));
            this.bonus.push(new Bonus(game, "sizeBonus"));

            this.malus.push(new Malus(game, "speedMalus"));
            this.malus.push(new Malus(game, "sizeMalus"));
        }

        this.walls.push(new Wall(game, 20, 400, 10, 770));
        this.walls.push(new Wall(game, 980, 400, 10, 770));
        this.walls.push(new Wall(game, 500, 10, 970, 10));
        this.walls.push(new Wall(game, 500, 790, 970, 10));

        this.ball = new Ball(game, 500, 400);
    }
}
