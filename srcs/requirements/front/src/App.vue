<script setup>
import Header from "@/components/Header.vue";
</script>

<template>
  <body>
    <Header />
    <router-view></router-view>
  </body>
</template>

<style scoped>
body {
  display: flex;
  flex-direction: column;
  background-color: #423e3e;
}
</style>