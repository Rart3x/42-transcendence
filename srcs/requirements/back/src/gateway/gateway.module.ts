import { Module } from '@nestjs/common';
import { AppGateway } from './gateway';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule],
    controllers: [],
    providers: [],
    exports: [],
})

export class GatewayModule {}