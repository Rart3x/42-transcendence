<script setup>
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";

import Header from "@/components/Header.vue";
</script>

<template>
  <body class="body">
    <div class="item">
      <ol>
        <ul class="list_content">
          <h1>Welcome to PMT</h1>
        </ul>
        <ul class="list_content">
          <img src="@/components/images/icon-pmt.png" class="icon" />
        </ul>
      </ol>
    </div>
  </body>
</template>

<style scoped>
.list_content {
  text-align: center;
}

.body {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
