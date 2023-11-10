import { Bodies } from 'matter-js'

export default class Wall{
    gameObject: any;
    x : number;
    y : number;
    width: number;
    height : number;
    label : string;

    constructor(x : number, y : number, width: number, height: number, label: string){
        const wallOptions = {
			isStatic: true,
            color: 0xdb2e94ff,
            label: label
		}

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.label = label;

        this.gameObject = Bodies.rectangle(this.x, this.y, this.width, this.height, wallOptions);
    }
}
