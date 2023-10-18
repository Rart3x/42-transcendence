import { QueueList } from "../queueList/queueList.interface"

export interface User {
    userId: number;
    userName: string | null;
    image: string | null;
    QueueList: QueueList[];
}
