import Phaser from 'phaser';

export default class Player {
    id: string;
    gameObject?: any;
    x : number;
    y : number;
    width: number;
    height : number;
    socket : string;
    game: Phaser.Scene;

    constructor(game: Phaser.Scene, x : number, y : number, width: number, height: number, socket: string, color: number){
        const playerOptions = {
			isStatic: true
		}

        this.game = game;
        this.socket = socket;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        if (color == 1)
            this.gameObject = this.game.add.rectangle(x, y, width, height, 0xff0000);
        else if (color == 2)
            this.gameObject = this.game.add.rectangle(x, y, width, height, 0x0000ff);
        this.game.matter.add.gameObject(this.gameObject, playerOptions);
    }
}
