<script setup lang="ts">
  import GameConfig from "@/components/GameConfig.vue";
</script>

<template>
  <div id="game" class="bg-black">
    <GameConfig/>
  </div>
</template>

<style scoped>
  #game{ position: absolute; max-height: 90vh; }
</style>
