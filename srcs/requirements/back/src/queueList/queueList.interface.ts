import { User } from '../user/user.interface';

export interface QueueList {
    queueId: number;
    userId: number;
    clientSocket: string;
    User: User;
}
