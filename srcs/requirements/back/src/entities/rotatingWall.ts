import { Bodies } from 'matter-js'

export default class RotatingWall{
    gameObject: any;
    x : number;
    y : number;
    width: number;
    height : number;
    angle: number;

    constructor(x : number, y : number, width: number, height: number){
        const wallOptions = {
			isStatic: true,
            color: 0xffffffff,
		}

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = 0;
        this.gameObject = Bodies.rectangle(this.x, this.y, this.width, this.height, wallOptions);
    }

    rotate(delta: number){
        this.angle += delta;
        this.gameObject.angle = this.angle;
    }
}
