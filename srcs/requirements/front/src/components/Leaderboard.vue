
<script setup>
  import { onMounted, ref} from "vue";
  import { getAllUsers } from "./api/get.call";
  
  let users = ref(null);
  onMounted(async () => {
    users = await getAllUsers();
    console.log(users);
  });

</script>

<template>
    <div class="stats shadow">
    <div class="stat">
        <div v-for="user in users" :key="user">
            <div class="stat-title">Username</div>
            <div v-if="user" class="stat-value"> {{ user.userName }} </div>
        </div>
    </div>
    </div>
</template>

<style scoped>
</style>
