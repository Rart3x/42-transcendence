import { IsNotEmpty } from 'class-validator';

export class CreateChannelDTO {
  @IsNotEmpty({ message: 'error: channelName cant be empty' })
  channelName: string;

  @IsNotEmpty({ message: 'error: userName cant be empty' })
  userName: string;

  @IsNotEmpty({ message: 'error: invitedUserName cant be empty' })
  invitedUserName: string;

  constructor(channelData: Partial<CreateChannelDTO>) {
    Object.assign(this, channelData);
  }
}