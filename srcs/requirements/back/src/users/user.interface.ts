import { QueueList } from "../queueList/queueList.interface"
import { GameRoom } from "../gameRoom/gameRoom.interface"

export interface User {
    userId: number;
    userName: string | null;
    image: string | null;
    friendsID:  number[];
    roomId: number | null;
    room: GameRoom | null;
    queue: QueueList | null;
    queueId : number | null;
    socketID : string | null; 
}

