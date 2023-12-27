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
    initializeSocket({ commit }) {
      const socket = io('http://localhost:3000');
      commit('SET_SOCKET', socket);
    },
    invitationInGame(context, body) {
      const socket = context.state.socket;
      if (socket){
        socket.emit('invitationInGame', body);
      }
      else
        console.error('error: socket uninitialized');
    },
    friendAdded(context, body) {
      const socket = context.state.socket;
      if (socket){
        socket.emit('friendAdded', body);
      }
      else
        console.error('error: socket uninitialized');
    },
    friendRemoved(context, body) {
      const socket = context.state.socket;
      if (socket){
        socket.emit('friendRemoved', body);
      }
      else
        console.error('error: socket uninitialized');
    },
    test(context) { 
    }
  }
});

export default store;