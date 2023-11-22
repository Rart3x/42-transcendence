import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketIO from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
	createIOServer(port: number, options?: socketIO.ServerOptions): socketIO.Server {
		const server = super.createIOServer(port, options);

		server.origins('http://localhost:5173');

		return server;
	}
}