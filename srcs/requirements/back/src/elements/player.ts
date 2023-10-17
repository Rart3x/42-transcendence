class Player {
    id: string;
    gameObject?: any;

    constructor(socketId: string, gameObject: any) {
        this.id = socketId;
        this.gameObject = gameObject;
    }
}

export default Player;