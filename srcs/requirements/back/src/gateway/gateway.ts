import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnModuleInit{

  @WebSocketServer()
  server : Server;

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log('new connection on ' + socket.id);
		});
	}

  @SubscribeMessage('invitationInGame')
  handleInvitationInGame(@MessageBody() body): any {
    this.server.to(body.userSocket).emit('invitedInGame', body);
  }

  // @SubscribeMessage('invitationInGameAccepted')
  // handleInvitationInGameAccepted(@MessageBody() body): any {
  //   this.server.to(body.userSocket).emit('invitedInGameAccepted', body);
  // }

  // @SubscribeMessage('invitationInGameDeclined')
  // handleInvitationInGameDeclined(data: any) {
  //   this.server.to(data.userSocket).emit('invitationInGameDeclined', data);
  // }
}