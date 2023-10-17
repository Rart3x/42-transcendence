import * as Matter from 'matter-js';

class rectWrapper{
    x : number;
    y : number;
    width: number;
    height : number;
    label : string;

    constructor(x : number, y : number, width: number, height: number, label: string){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.label = label;
    }
}

export default rectWrapper;
