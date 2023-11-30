import { Bodies } from 'matter-js'

export default class Player {
    id: string;
    gameObject?: any;
    x : number;
    y : number;
    width: number;
    height : number;
    socket : string;

    constructor(x : number, y : number, width: number, height: number, socket: string, label: string){
        const playerOptions = {
            color: 0xdb2e94ff,
			isStatic: true,
            label: label
		}

        this.socket = socket;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gameObject = Bodies.rectangle(this.x, this.y, this.width, this.height, playerOptions);
    }
}
