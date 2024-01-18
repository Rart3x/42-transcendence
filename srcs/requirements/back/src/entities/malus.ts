import { Bodies } from 'matter-js';

export default class Malus{
    gameObject: any;
    x: number;
    y: number;
    type: string;
    
    constructor(type: string) {
        const ballOptions = {
			isStatic: true,
            color: 0xffffffff,
            label: type
		}
        this.x = 1000;
        this.y = 1000;
        this.type = type;
        this.gameObject = Bodies.rectangle(1000, 1000, 200, 200, ballOptions);
    }
}
