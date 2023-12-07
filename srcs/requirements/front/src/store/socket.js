import { createStore } from 'vuex'
import io from 'socket.io-client';

const store = createStore({
 state: {
   socket: null,
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
 },
})

export default store;