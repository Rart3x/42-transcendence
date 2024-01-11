<script setup>
  import Cookies from "js-cookie";
  import { getUserByUserId } from "./api/get.call";
  import { onMounted, ref } from "vue";

  let text = ' ft_transcendence';
  let currentIndex = ref(-1);
  let listItemIndex = ref(-1);

  const user = ref(null);
  const signInWithIntra = () => {
     window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${
      import.meta.env.VITE_CLIENT_ID
    }&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=code`;
  };

  onMounted(async () => {
    try {
      const cookieJWT = Cookies.get("Bearer");
      const cookieUserId = Cookies.get("UserId");
      if (cookieJWT && cookieUserId){
        user.value = await getUserByUserId(cookieUserId, cookieJWT);
      }
      if (user){
        animateText();
      }
    } catch (error) {
      console.error("Failed to fetch user data: ", error);
    }
  });

  const animateText = () => {
    const textInterval = setInterval(() => {
      if (currentIndex.value < text.length)
        currentIndex.value++;
      else {
        clearInterval(textInterval);
        animateList();
      }
    }, 1);
  };

  const animateList = () => {
    const listItems = document.querySelectorAll('.list-disc li');

    const listInterval = setInterval(() => {
      if (listItemIndex.value < listItems.length) {
        animateListItem(listItems[listItemIndex.value]);
        listItemIndex.value++;
      }
      else
        clearInterval(listInterval);
    },1);
  };

  const animateListItem = (element) => {
    setTimeout(() => {
      if (element) {
        element.classList.add('animate');
      }
    }, 100);
  };
</script>

<template>
  <div class="hero bg-base-200" :class="[user ? activeClass: 'min-h-[calc(100vh-174px)]', 'min-h-screen']">
    <div class="hero-content text-center">
      <div class="max-w-4xl">
        <h1 class="text-7xl flex justify-center font-mono font-bold bg-clip-text bg-gradient-to-r from-primary to-secondary">
          <template v-for="(letter, index) in text" :key="index">
            <span v-if="index === 0 || (index <= currentIndex && currentIndex !== -1)" :class="{ 'highlight': currentIndex === index, 'visible': currentIndex > index }">
              {{ letter }}
            </span>
            <span v-else> &nbsp; </span>
          </template>
        </h1>
          <ul class="list-disc py-6 font-mono space-y-3 marker:text-secondary">
           <li>Pong game with normal and custom game in multiplayer</li>
           <li>Chat with clients, channels, ...</li>
           <li>Profile customization, friends list, 2FA authentication</li>
          </ul>
         <ul class="list-disc" style="list-style-type: none;">
          <li>
            <button v-if="!user" class="btn btn-glass flex-grow w-64 bg-primary text-white opacity-70" @click="signInWithIntra">
              Sign in with 42
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
  body { min-height: 100%; }
  .highlight { background-color: #f0f0f0; }
  .visible { background-color: transparent; }

  .list-disc li {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  }
  .list-disc li.animate { opacity: 1; transform: translateY(0); }
</style>
