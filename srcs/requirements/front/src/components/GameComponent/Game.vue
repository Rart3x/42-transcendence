<script lang="ts">
import { onBeforeUnmount, onBeforeMount, getCurrentInstance } from 'vue';
import GameConfig from "./GameConfig.vue";
import store from '../../store/store.js';
import EventBus from '../../services/event-bus';

export default {
 name: 'Game',
 components: {
   GameConfig
 },
 data() {
  return {
    gameKey: 0
  }
 },
 methods: {
  refreshGame(){
    this.gameKey += 1;
  }
 },
 created() {
    const eventBus = EventBus.getInstance();
      eventBus.subscribe('refreshGame', this.refreshGame);
    },
    beforeDestroy() {
      const eventBus = EventBus.getInstance();
      eventBus.unsubscribe('refreshGame', this.refreshGame);
    }
};
</script>

<template>
  <div :key="gameKey" id="game" class="bg-black font-mono">
    <GameConfig/>
  </div>
</template>

<style scoped> #game{ position: absolute; max-height: 92.8vh; display: block } </style>