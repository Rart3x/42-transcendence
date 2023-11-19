
<script>
import { onMounted, ref } from "vue";
import { getAllUsers } from "./api/get.call";

export default {
 setup() {
   const users = ref([]);

   onMounted(async () => {
     users.value = await getAllUsers();
   });

   return {
     users
   };
 },
 computed: {
   sortUser: function() {
     return this.users.sort().reverse();
   }
 },
};

</script>

<template>
    <div v-for="(user,index) in sortUser" :key="user">
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title"> Rank </div>
          <div v-if="user" class="stat-value"> {{ index + 1 }} </div>
        </div>
        <div class="stat">
          <div class="stat-title"> Username </div>
          <div class="stat-value"> {{ user.userName }} </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
</style>
