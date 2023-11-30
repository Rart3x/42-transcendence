import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST', 'DELETE'],
		credentials: true
	}
})
export class AppGateway {
  @SubscribeMessage('invitationInGame')
  handleInvitation(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    if (data.userStatus === 'online')
      client.emit('invitationInGameSuccess', { message: 'Invitation received successfully' });
    else
      client.emit('invitationInGameFailed', { message: 'Failed to send invitation' });
  }
}
