import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserService } from '../user/user.service';

@WebSocketGateway({
	cors : {
		origin: '*',
	},
})
export class AppGateway implements OnModuleInit{

  @WebSocketServer()
  server : Server;

  constructor(
		private readonly UserService: UserService
  ){}

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log('new connection on ' + socket.id);
		});
	}

  @SubscribeMessage('friendAdded')
  handleFriendAdded(@MessageBody() body): any {
    this.server.to(body.socket).emit('friendAdded');
  }

  @SubscribeMessage('friendRemoved')
  handleFriendRemoved(@MessageBody() body): any {
    this.server.to(body.socket).emit('friendRemoved');
  }

  @SubscribeMessage('invitationInGame')
  handleInvitationInGame(@MessageBody() body): any {
    this.server.to(body.socket).emit('invitedInGame', body);
  }

  @SubscribeMessage('invitationInGameAccepted')
  handleInvitationInGameAccepted(@MessageBody() body): any {
    this.server.to(body.socket).emit('invitationAccepted', body);
  }

  @SubscribeMessage('invitationInGameDeclined')
  handleInvitationInGameDeclined(@MessageBody() body): any {
    this.server.to(body.socket).emit('invitationDeclined', body);
  }

  @SubscribeMessage('messageToChannel')
  handleMessageToChannel(@MessageBody() body): any {
    for (const user of body.usersInChannel) {
      this.server.to(user.socket).emit('messageToChannel', body);
    }
  }

  @SubscribeMessage('sendPrivateMessage')
  handleSendPrivateMessage(@MessageBody() body): any {
    this.server.to(body.socket).emit('receiveMessage', body);
  }

}
