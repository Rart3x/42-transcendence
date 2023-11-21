<script setup>
import Cookies from "js-cookie";
import { getUserByCookie } from "./api/get.call";
import { onMounted, ref } from "vue";

let user = ref(null);

onMounted(async () => {
  user.value = await getUserByCookie(Cookies.get("_authToken"));
});

const signInWithIntra = () => {
  window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${
    import.meta.env.VITE_CLIENT_ID
  }&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=code`;
};
</script>

<template>
 <body>
   <div class="hero min-h-screen bg-base-200">
     <div class="hero-content text-center">
       <div class="max-w-md">
         <h1 class="text-7xl flex justify-center font-mono font-bold bg-clip-text bg-gradient-to-r from-primary to-secondary">
           ft_transcendence
         </h1>
         <ul class="list-disc py-6 font-mono space-y-3 marker:text-secondary">
           <li>Pong game with normal and custom game in multiplayer</li>
           <li>Chat with clients, channels, ...</li>
           <li>Profile customization, friends list, 2FA authentication</li>
         </ul>
         <button v-if="!user" class="btn btn-glass flex-grow w-64 bg-primary text-white opacity-70" @click="signInWithIntra">
          Sign in with 42
        </button>
        </div>
     </div>
   </div>
 </body>
</template>


<style scoped>
.the-background-image {
  width: 92vw;
  height: 92vh;
  background-image: url("./images/kramjatt.jpg");
  align-self: center;
}
body{
  min-height: 100%;
}



</style>
