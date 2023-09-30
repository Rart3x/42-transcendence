import { Injectable } from '@nestjs/common';
import { User } from '../interfaces/user.interface'

@Injectable()
export class UserService {
    private readonly users: User[] = [];

    create(user: User) {
        this.users.push(user);
    }
    findAll(): User[] {
        console.log("Ceci est un test");
        return this.users;
    }
}