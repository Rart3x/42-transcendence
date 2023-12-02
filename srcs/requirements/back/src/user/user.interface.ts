import { GameRoom } from "../gameRoom/gameRoom.interface"
import { Stat } from "../stat/stat.interface"

export interface User {
    userId: number;
    userName: string | null;
    
    friends: number[] | null;
    
    roomId: number | null;
    room: GameRoom | null;

    statId: number | null;
    stat: Stat | null;

    cookie: string | null;
    image: string | null;
    socket: string | null; 
}