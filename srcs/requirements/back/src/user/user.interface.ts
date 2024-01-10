import { GameRoom } from "../gameRoom/gameRoom.interface"

export interface User {
    userId: number;
    userName: string | null;
    
    friends: number[] | null;
    
    roomId: number | null;
    room: GameRoom | null;

    cookie: string | null;
    image: string | null;
    socket: string | null; 
}