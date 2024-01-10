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
    connectToGameNameSpace({ commit }){
      const socket = io('http://localhost:3000/game');
      console.log('Connected to game namespace');
      commit('SET_SOCKET', socket);
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
      return new Promise((resolve, reject) => {
        console.log("reset socket");
        const socket = io('http://localhost:3000');
        socket.on('connect', () => {
          commit('SET_SOCKET', socket);
          resolve();
        });
        socket.on('connect_error', (err) => {
          reject(err);
        });
      });
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
    removeChannel(context, body) {
      const socket = context.state.socket;
      if (socket)
        socket.emit('removeChannel', body);
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