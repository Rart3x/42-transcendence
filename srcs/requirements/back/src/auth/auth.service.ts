import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private UserService: UserService) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.UserService.getUserByName(username);

  }
}
