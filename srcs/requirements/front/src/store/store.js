import { createStore } from 'vuex';
import io from 'socket.io-client';

const store = createStore({
  state: {
    socket: null
  },
  mutations: {
    SET_SOCKET(state, socket) {
      state.socket = socket;
    },
  },
  actions: {
    blockUser(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('blockUser', body);
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
      const socket = io('http://localhost:3000');
      commit('SET_SOCKET', socket);
    },
    invitationInGame(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('invitationInGame', body);
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
    newChannelSuggestion(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('newChannelSuggestion', body);
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
    }
  }
});

export default store;