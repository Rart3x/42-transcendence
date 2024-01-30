import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';

@WebSocketGateway({
	cors : {
		origin: '*',
	},
})
export class AppGateway {

  @WebSocketServer()
  server : Server;

  constructor(private readonly UserService: UserService){}

	async handleDisconnect(socket: Socket) {
    try {
      const user = await this.UserService.getUserBySocket(socket.id);
      if (user)
        await this.UserService.updateStatus(user.userId, "offline");
    }
    catch(error) {
      console.log(error);
    } 
  }
  @SubscribeMessage('addOperator')
  handleAddOperator(@MessageBody() body): any {
    this.server.to(body.socket).emit('addOperator', body);
  }

  @SubscribeMessage('banUser')
  handleBanUser(@MessageBody() body): any {
    this.server.to(body.socket).emit('banned', body);
  } 

  @SubscribeMessage('blockUser')
  handleBlockUser(@MessageBody() body): any {
    this.server.to(body.socket).emit('blocked', body);
  }

  @SubscribeMessage('channelPrivate')
  handleChannelPrivate(@MessageBody() body): any {
    this.server.to(body.socket).emit('channelPrivate', body);
  }

  @SubscribeMessage('friendAdded')
  handleFriendAdded(@MessageBody() body): any {
    this.server.to(body.socket).emit('friendAdded');
  }

  @SubscribeMessage('friendRemoved')
  handleFriendRemoved(@MessageBody() body): any {
    this.server.to(body.socket).emit('friendRemoved');
  }

  @SubscribeMessage('friendRequest')
  handleFriendRequest(@MessageBody() body): any {
    this.server.to(body.socket).emit('friendRequest', body);
  }

  @SubscribeMessage('friendRequestAccepted')
  handleFriendRequestAccepted(@MessageBody() body): any {
    this.server.to(body.socket).emit('friendRequestAccepted', body);
  }

  @SubscribeMessage('friendRequestDeclined')
  handleFriendRequestDeclined(@MessageBody() body): any {
    this.server.to(body.socket).emit('friendRequestDeclined');
  }

  @SubscribeMessage('invitationInChannel')
  handleInvitationInChannel(@MessageBody() body): any {
    this.server.to(body.socket).emit('invitationInChannel', body);
  }

  @SubscribeMessage('invitationInGame')
  handleInvitationInGame(@MessageBody() body): any {
    this.server.to(body.socket).emit('invitationInGame', body);
  }

  @SubscribeMessage('invitationInChannelAccepted')
  handleInvitationInChannelAccepted(@MessageBody() body): any {
    this.server.to(body.socket).emit('invitationAccepted', body);
  }

  @SubscribeMessage('invitationInChannelDeclined')
  handleInvitationInChannelDeclined(@MessageBody() body): any {
    this.server.to(body.socket).emit('invitationDeclined', body);
  }

  @SubscribeMessage('invitationInGameAccepted')
  handleInvitationInGameAccepted(@MessageBody() body): any {
    this.server.to(body.socket).emit('invitationInGameAccepted', body);
  }

  @SubscribeMessage('invitationInGameDeclined')
  handleInvitationInGameDeclined(@MessageBody() body): any {
    this.server.to(body.socket).emit('invitationInGameDeclined', body);
  }

  @SubscribeMessage('kickUser')
  handleKickUser(@MessageBody() body): any {
    this.server.to(body.socket).emit('kicked', body);
  }

  @SubscribeMessage('messageToChannel')
  handleMessageToChannel(@MessageBody() body): any {
    this.server.to(body.socket).emit('messageToChannel', body);
  }

  @SubscribeMessage('modalClose')
  handleModalClose(@MessageBody() body): any {
    this.server.to(body.socket).emit('modalClose', body);
  }

  @SubscribeMessage('modalOpen')
  handleModalOpen(@MessageBody() body): any {
    this.server.to(body.socket).emit('modalOpen', body);
  }

  @SubscribeMessage('muteUser')
  handleMuteUser(@MessageBody() body): any {
    this.server.to(body.socket).emit('muted', body);
  }

  @SubscribeMessage('newChannelMember')
  handleNewChannelMember(@MessageBody() body): any {
    this.server.to(body.socket).emit('newChannelMember', body);
  }

  @SubscribeMessage('newChannelPass')
  handleNewChannelPass(@MessageBody() body): any {
    this.server.to(body.socket).emit('newChannelPass', body);
  }

  @SubscribeMessage('newChannelSuggestion')
  handleNewChannelSuggestion(@MessageBody() body): any {
    this.server.to(body.socket).emit('newChannelSuggestion', body);
  }

  @SubscribeMessage('newUser')
  handleNewUser(@MessageBody() body): any {
    this.server.to(body.socket).emit('newUser', body);
  }

  @SubscribeMessage('removeChannel')
  handleRemoveChannel(@MessageBody() body): any {
    this.server.to(body.socket).emit('removeChannel', body);
  }

  @SubscribeMessage('removeOperator')
  handleRemoveOperator(@MessageBody() body): any {
    this.server.to(body.socket).emit('removeOperator', body);
  }

  @SubscribeMessage('removeUserFromChannel')
  handleRemoveUserFromChannel(@MessageBody() body): any {
    this.server.to(body.socket).emit('removeUserFromChannel', body);
  }

  @SubscribeMessage('sendPrivateMessage')
  handleSendPrivateMessage(@MessageBody() body): any {
    this.server.to(body.socket).emit('receiveMessage', body);
  }

  @SubscribeMessage('unblockUser')
  handleUnblockUser(@MessageBody() body): any {
    this.server.to(body.socket).emit('unblocked', body);
  }

  @SubscribeMessage('updateDM')
  handleUpdateDM(@MessageBody() body): any {
    this.server.to(body.socket).emit('updateDM', body);
  }

  @SubscribeMessage('updateProfile')
  handleUpdateProfile(@MessageBody() body): any {
    this.server.to(body.socket).emit('updateProfile', body);
  }
}
