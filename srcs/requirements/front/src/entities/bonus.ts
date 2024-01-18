import Phaser from 'phaser';

export default class Bonus{
    gameObject: any;
    x: number;
    y: number;
    game: Phaser.Scene;
    type: string;

    constructor(game: Phaser.Scene, type: string) {
        const bonusOptions = {
			isStatic: false
		}
        this.game = game;
        this.x = 1000;
        this.y = 1000;
        this.gameObject = this.game.add.rectangle(1000, 1000, 200, 200, 0x008000ff);
		//Default ball velocity
        this.game.matter.add.gameObject(this.gameObject, bonusOptions);
        this.gameObject.setVelocity(0, 0);

        console.log(this.gameObject);

    }
}
