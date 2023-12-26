import { OnModuleInit } from '@nestjs/common';
import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { Cookies } from 'js-cookie';
import { UserService } from '../user/user.service';

@WebSocketGateway()
export class AppGateway implements OnModuleInit{

  @WebSocketServer()
  server : Server;

  constructor(
		private readonly UserService: UserService
  ){}

	onModuleInit() {
		this.server.on('connection', (socket) => {
			// console.log('new connection on ' + socket.id);
		});
	}

	handleConnection(socket: Socket){
    const userId = Cookies.get("userId")
    if (userId){
      this.UserService.setSocket(userId, socket.toString())
    }
  }

  
  @SubscribeMessage('invitationInGame')
  handleInvitationInGame(@MessageBody() body): any {
    this.server.to(body.userSocket).emit('invitedInGame', body);
  }

  @SubscribeMessage('invitationInGameAccepted')
  handleInvitationInGameAccepted(@MessageBody() body): any {
    this.server.to(body.userSocket).emit('invitationAccepted', body);
  }

  @SubscribeMessage('invitationInGameDeclined')
  handleInvitationInGameDeclined(@MessageBody() body): any {
    this.server.to(body.userSocket).emit('invitationDeclined', body);
  }
}
