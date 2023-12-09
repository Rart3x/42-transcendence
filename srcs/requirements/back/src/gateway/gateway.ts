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

  // @SubscribeMessage('invitationInGame')
  // handleInvitationInGame(@MessageBody() body): any {
  //   console.log("invitationInGame : " + body.userSocket);
  //   this.server.to(body.userSocket).emit('invitedInGame', body);
  // }

  @SubscribeMessage('eventName')
  handleEventName(@MessageBody() body): any {
    console.log("eventName : " + body.userSocket);
  }

  // @SubscribeMessage('invitationInGameAccepted')
  // handleInvitationInGameAccepted(@MessageBody() body): any {
  //   console.log("invitationInGameAccepted " + body.userSocket);
  //   this.server.to(body.userSocket).emit('invitationAccepted', body);
  // }

  // @SubscribeMessage('invitationInGameDeclined')
  // handleInvitationInGameDeclined(@MessageBody() body): any {
  //   console.log("invitationInGameDeclined : " + body.userSocket);
  //   this.server.to(body.userSocket).emit('invitationDeclined', body);
  // }
}