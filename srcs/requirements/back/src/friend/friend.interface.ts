import { User } from "../user/user.interface"

export interface Friend {
    friendId: number;
    friendList: User[];
}