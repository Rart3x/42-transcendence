export interface Score {
    time: number;
    scorerId: number;
    score: UserScore[];
}

interface UserScore {
    userId: number;
    score: number;
}
