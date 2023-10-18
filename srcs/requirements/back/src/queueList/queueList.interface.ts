import { User } from '../users/user.interface';

export interface QueueList {
    queueId: number;
    userId: number;
    clientSocket: string;
    User: User;
}
