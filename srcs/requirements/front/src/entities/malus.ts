import Phaser from 'phaser';

export default class Malus{
    gameObject: any;
    x: number;
    y: number;
    game: Phaser.Scene;
    type: string;
    
    constructor(game: Phaser.Scene, type: string) {
        const malusOptions = {
			isStatic: false
		}
        this.game = game;
        this.x = 1000;
        this.y = 1000;
        this.gameObject = this.game.add.rectangle(1000, 1000, 200, 200, 0xff0000ff);
		//Default ball velocity
        this.game.matter.add.gameObject(this.gameObject, malusOptions);
        this.gameObject.setVelocity(0, 0);

        console.log(this.gameObject);
    }
}
