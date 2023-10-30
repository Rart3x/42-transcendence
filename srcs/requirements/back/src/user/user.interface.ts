import { GameRoom } from "../gameRoom/gameRoom.interface"
import { Friend } from "../friend/friend.interface"
import { Stat } from "../stat/stat.interface"
import { QueueList } from "../queueList/queueList.interface"

export interface User {
    userId: number;
    userName: string | null;
    
    friendsId: number | null;
    friends:  Friend;
    
    roomId: number | null;
    room: GameRoom | null;
    
    queueId : number | null;
    queue: QueueList | null;

    statId: number | null;
    stat: Stat | null;

    cookie: string | null;
    image: string | null;
    socket : string | null; 
}