import { User } from '../user/user.interface';

export interface GameRoom {
    roomId: number;
    Client: User[];
}
