import { IsNotEmpty } from 'class-validator';

export class CreateDMDTO {
    @IsNotEmpty({ message: 'error: message cant be empty' })
    messageContent: string;

    @IsNotEmpty({ message: 'error: senderName cant be empty' })
    senderName: string;

    @IsNotEmpty({ message: 'error: receiverName cant be empty' })
    receiverName: string;

    constructor(channelData: Partial<CreateDMDTO>) {
        Object.assign(this, channelData);
    }
}