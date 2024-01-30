import { createStore } from 'vuex';
import io from 'socket.io-client';

const store = createStore({
  state: {
    socket: null,
    invited: false
  },
  mutations: {
    SET_SOCKET(state, socket) {
      state.socket = socket;
    },
    SET_INVITED(state, invited) {
      state.invited = invited;
    }
  },
  actions: {
    addOperator(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('addOperator', body);
      else
        console.error('error: socket uninitialized');
    },
    banUser(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('banUser', body);
      else
        console.error('error: socket uninitialized');
    },
    blockUser(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('blockUser', body);
      else
        console.error('error: socket uninitialized');
    },
    channelPrivate(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('channelPrivate', body);
      else
        console.error('error: socket uninitialized');
    },
    friendAdded(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('friendAdded', body);
      else
        console.error('error: socket uninitialized');
    },
    friendRemoved(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('friendRemoved', body);
      else
        console.error('error: socket uninitialized');
    },
    friendRequest(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('friendRequest', body);
      else
        console.error('error: socket uninitialized');
    },
    initializeSocket({ commit }) {
      const socket = io('https://localhost:3000');
      commit('SET_SOCKET', socket);
    },
    invitationInGame(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('invitationInGame', body);
      else
        console.error('error: socket uninitialized');
    },
    kickUser(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('kickUser', body);
      else
        console.error('error: socket uninitialized');
    },
    messageToChannel(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('messageToChannel', body);
      else
        console.error('error: socket uninitialized');
    },
    modalClose(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('modalClose', body);
      else
        console.error('error: socket uninitialized');
    },
    modalOpen(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('modalOpen', body);
      else
        console.error('error: socket uninitialized');
    },
    muteUser(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('muteUser', body);
      else
        console.error('error: socket uninitialized');
    },
    newChannelMember(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('newChannelMember', body);
      else
        console.error('error: socket uninitialized');
    },
    newChannelPass(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('newChannelPass', body);
      else
        console.error('error: socket uninitialized');
    },
    newChannelSuggestion(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('newChannelSuggestion', body);
      else
        console.error('error: socket uninitialized');
    },
    newUser(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('newUser', body);
      else
        console.error('error: socket uninitialized');
    },
    removeChannel(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('removeChannel', body);
      else
        console.error('error: socket uninitialized');
    },
    removeOperator(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('removeOperator', body);
      else
        console.error('error: socket uninitialized');
    },
    removeUserFromChannel(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('removeUserFromChannel', body);
      else
        console.error('error: socket uninitialized');
    },
    sendPrivateMessage(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('sendPrivateMessage', body);
      else
        console.error('error: socket uninitialized');
    },
    unblockUser(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('unblockUser', body);
      else
        console.error('error: socket uninitialized');
    },
    updateDM(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('updateDM', body);
      else
        console.error('error: socket uninitialized');
    },
    updateProfile(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('updateProfile', body);
      else
        console.error('error: socket uninitialized');
    }
  }
});

export default store;