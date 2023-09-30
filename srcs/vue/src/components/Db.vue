<template>
</template>
  
<script>
  import { UserService } from 'db/user.service.ts';
  
  export default {
    data() {
      return {
        users: [],
      };
    },
    created() {
      const userService = new UserService();
      userService.findAll()
        .then(response => {
          this.users = response;
        })
        .catch(error => {
          console.error(error);
        });
    },
  };
</script>