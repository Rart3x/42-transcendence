<script setup>
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";

import Header from "@/components/Header.vue";
</script>

<template>
  <div class="item">
    <ol>
      <ul class="list_content">
        <h1>Welcome to PMT</h1>
      </ul>
      <ul class="list_content">
        <img src="@/components/icons/icon-pmt.png" class="icon" />
      </ul>
    </ol>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2vh;
}

.list_content {
  text-align: center;
}
</style>
