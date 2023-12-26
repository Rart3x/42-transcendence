import { Module } from '@nestjs/common';
import { AppGateway } from './gateway';
import { UserModule } from '../user/user.module';

@Module({
    imports: [UserModule],
    providers: [AppGateway],
})

export class GatewayModule {}