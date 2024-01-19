import Phaser from 'phaser';

export default class Wall{
    gameObject: any;
    x : number;
    y : number;
    width: number;
    height : number;
    label : string;
    game: Phaser.Scene;

    constructor(game: Phaser.Scene, x : number, y : number, width: number, height: number, label: string){
        const wallOptions = {
			isStatic: true,
            render: {
                visible: false
            }
		}

        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        

        if (label == "leftmid" || label == "rightmid")
            this.gameObject = this.game.add.rectangle(x, y, width, height, 0x000000);
        else
            this.gameObject = this.game.add.rectangle(x, y, width, height, 0xffffff);

        this.game.matter.add.gameObject(this.gameObject, wallOptions);
        this.gameObject.name = label;

    }
}
