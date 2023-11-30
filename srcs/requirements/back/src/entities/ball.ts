import { Bodies } from 'matter-js'

export default class Ball {
    gameObject: any;
    x: number;
    y: number;

    constructor(x: number, y: number) {
        const ballOptions = {
			restitution : 1,
			inertia: Infinity,
			friction: 0,
			frictionStatic: 0,
			frictionAir : 0,
			isStatic: false,
            color: 0xdb2e94ff,
            label: 'ball'
		}
        this.x = x;
        this.y = y;
        this.gameObject = Bodies.rectangle(x, y, 15, 15, ballOptions);
    }
}
