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

  @SubscribeMessage('message')
  onNewMessage(@MessageBody() body): any {
    console.log(body);
    this.server.emit('response', 'Received your message');
  }
}