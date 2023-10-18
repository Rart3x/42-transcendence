import { User } from '../users/user.interface';

export interface GameRoom {
    roomId: number;
    Client: User[];
}
