<script lang="ts">
  import GameConfig from "./GameConfig.vue";
  import EventBus from '../../services/event-bus';
  import store from "../../store/store";

  export default {
    name: 'Game',
    components: {
      GameConfig
    },
    data() {
      return {
        gameKey: 0,
        eventBus: null
      }
    },
    methods: {
      refreshGame(){
        this.gameKey += 1;
      }
    },
    created() {
      this.eventBus = EventBus.getInstance();
      this.eventBus.subscribe('refreshGame', this.refreshGame);
      this.eventBus.emit('refreshGame');
      this.eventBus.emit('refreshHeader');
      console.log("refresh game")
    },
    beforeDestroy() {
      this.eventBus.unsubscribe('refreshGame', this.refreshGame);
    },
    unmounted() {
      if (store.state){
        console.log("disconnect socket")
        store.state.socket.disconnect();
        store.dispatch('initializeSocket');
      }
    }
  };
</script>

<template>
  <div :key="gameKey" id="game" class="bg-black font-mono">
    <GameConfig/>
  </div>
</template>

<style scoped> #game{ position: absolute; max-height: 92.8vh; display: block } </style>