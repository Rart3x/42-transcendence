import Phaser from 'phaser';

export default class Malus{

    game: Phaser.Scene;
    type: string;
    rect: Phaser.Geom.Rectangle;
    graphics: Phaser.GameObjects.Graphics;

    constructor(game: Phaser.Scene, type: string) {
        this.game = game;
        this.type = type;
        this.graphics = this.game.add.graphics({ fillStyle: { color: 0xff0000ff } });
    }

    clear(){
        console.log("clear");
        this.graphics.clear();
    }

    draw(x: number, y: number){
        this.graphics.clear();
        this.game.add.graphics({ fillStyle: { color: 0xff0000ff } });
        const rect = new Phaser.Geom.Rectangle(x, y, 200, 200);
        this.graphics.fillRectShape(rect);
    }
}
