import { Waiter } from "../waiters/waiter.interface"

export interface User {
    userId: number;
    userName: string | null;
    image: string | null;
    Waiters: Waiter[];
    friendsID:  number[];
}