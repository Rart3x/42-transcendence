import { GameRoom } from "../gameRoom/gameRoom.interface"
import { Friend } from "../friend/friend.interface"
import { QueueList } from "../queueList/queueList.interface"

export interface User {
    userId: number;
    userName: string | null;
    image: string | null;
    friends:  Friend;
    roomId: number | null;
    room: GameRoom | null;
    queue: QueueList | null;
    queueId : number | null;
    socket : string | null; 
    cookie: string | null;
    QueueList: QueueList[];
}