import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';

import { NotifService } from './notif.service';
import { UserService } from '../user/user.service';

import { NotifController } from './notif.controller';

@Module({
    imports: [PrismaModule],
    providers: [NotifService, UserService],
    controllers: [NotifController],
    exports: [NotifService],
})

export class NotifModule {}