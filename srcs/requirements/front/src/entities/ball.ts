import Phaser from 'phaser';

export default class Ball{
    gameObject: any;
    x: number;
    y: number;
    game: Phaser.Scene;

    constructor(game: Phaser.Scene, x: number, y: number) {
        const ballOptions = {
			restitution : 1,
			inertia: Infinity,
			friction: 0,
			frictionStatic: 0,
			frictionAir : 0,
			isStatic: false
		}
        this.game = game;
        this.x = x;
        this.y = y;
        this.gameObject = this.game.add.rectangle(500, 400, 10, 10, 0xdb2e94ff);
		//Default ball velocity
        this.game.matter.add.gameObject(this.gameObject, ballOptions);
        this.gameObject.setVelocity(0, 0);
    }
}
