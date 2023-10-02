import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service'
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
    constructor (private prisma: PrismaService) {}

    async user(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
      ): Promise<User | null> {
        return this.prisma.user.findUnique({
          where: userWhereUniqueInput,
        });
    }
    
}