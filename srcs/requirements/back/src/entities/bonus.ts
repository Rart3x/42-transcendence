import { Bodies } from 'matter-js';

export default class Bonus{
    gameObject: any;
    x: number;
    y: number;
    type: string;
    
    constructor(type: string) {
        const bonusOptions = {
            label: type,
            isSensor: true
		}
        this.x = 1000;
        this.y = 1000;
        this.type = type;
        this.gameObject = Bodies.rectangle(1000, 1000, 200, 200, bonusOptions);

    }
}
