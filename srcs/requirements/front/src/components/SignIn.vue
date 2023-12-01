<script setup>
  import { ref, onMounted } from "vue";
  import { insertUser, setStatus} from './api/post.call.ts';
  import { getUserByUserName, checkA2F } from './api/get.call.ts';
  import { useRouter } from "vue-router";
  import Cookies from "js-cookie";

  let userInfo = ref(null);
  let user = ref(null);
  let userA2F = ref(null);
  let userToken = ref(null);

  const code = new URL(window.location.href).searchParams.get("code");

  const verifyToken = async () => {
    try {
      const isValid = await checkA2F(user.value.userName, userToken.value);

      if (isValid) {
        await insertUser(userInfo.value.login, userInfo.value.image.link, code);

        Cookies.set("_authToken", code, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });
        window.location.href = "/settings";
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  onMounted(async () => {
    const router = useRouter();
    try {
      if (code) {
        const response = await fetch("https://api.intra.42.fr/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: import.meta.env.VITE_CLIENT_ID,
            client_secret: import.meta.env.VITE_CLIENT_SECRET,
            code: code,
            redirect_uri: import.meta.env.VITE_REDIRECT_URI,
          }),
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const accessToken = data.access_token;

        const userResponse = await fetch("https://api.intra.42.fr/v2/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!userResponse.ok)
          throw new Error(`HTTP error! status: ${userResponse.status}`);

        user.value = await userResponse.json();
        userInfo.value = user.value;

        user.value = await getUserByUserName(userInfo.value.login);

        if (user.value && user.value.A2F) {
          userA2F.value = true;
          return ;
        }
        
        await insertUser(userInfo.value.login, userInfo.value.image.link, code);

        Cookies.set("_authToken", code, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });
        setStatus(user.value.userName, "online");
        window.location.href = "/settings";
      }
      else
      {
        router.push('/');
      }
      }
    catch (error) {
      router.push('/');
    }
  });
</script>

<template>
  <div v-if="userA2F" class="overflow-x-auto min-h-screen bg-base-200 font-mono flex flex-col items-center justify-center">
    <h1 class="title mb-8">Sign In with A2F</h1>
    <form @submit.prevent="verifyToken" class="flex flex-col items-center">
      <input class="input input-bordered mb-4" type="text" v-model="userToken" placeholder="Enter your token" required pattern="\d{6}" />
      <button class="btn glass" type="submit">Sign In</button>
    </form>
  </div>
</template>

<style scoped>
  .title { text-align: center; font-size: 50px; }
</style>