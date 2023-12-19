import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';

import { UserService } from './user.service';

import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';

@Module({
    imports: [PrismaModule],    
    providers: [
      UserService,
  
    ],
    controllers: [UserController],
    exports: [UserService]
})

export class UserModule {}
