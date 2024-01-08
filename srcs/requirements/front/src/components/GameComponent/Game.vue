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
 setup() {
  const eventBus = EventBus.getInstance();
   onBeforeMount(() => {
     console.log('Enter the route');
     store.dispatch('connectToGameNameSpace');
   });

   onBeforeUnmount(() => {
     console.log('Leaving the route');
      eventBus.emit('refreshHeader');
     store.dispatch('initializeSocket');
   });
 },
};
</script>

<template>
  <div id="game" class="bg-black font-mono">
    <GameConfig/>
  </div>
</template>

<style scoped> #game{ position: absolute; max-height: 92.8vh; display: block } </style>