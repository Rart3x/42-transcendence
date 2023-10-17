import { User } from '../users/user.interface';

export interface Waiter {
    waiterId: number;
    userId: number;
    waiterSocket: string;
    User: User;
}