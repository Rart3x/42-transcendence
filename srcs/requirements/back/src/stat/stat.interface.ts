import { User } from "../user/user.interface"

export interface Stat {
    statId:      number;
    gamePlayed:  number;
    gameWon:     number;
    users:       User[];
}