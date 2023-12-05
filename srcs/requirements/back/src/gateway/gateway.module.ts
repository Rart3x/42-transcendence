import { Module } from '@nestjs/common';
import { AppGateway } from './gateway';

@Module({
    imports: [AppGateway],
    controllers: [],
    providers: [],
    exports: [],
})

export class GatewayModule {}