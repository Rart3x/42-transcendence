<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { insertUser } from './api/post.call.ts';
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

const userInfo = ref(null);
const imageSrc = ref(null);

const code = new URL(window.location.href).searchParams.get("code");

onMounted(async () => {
  const router = useRouter();
  try {
    if (code || Cookies.get("_authToken")) {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const accessToken = data.access_token;

      const userResponse = await fetch("https://api.intra.42.fr/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const user = await userResponse.json();
      userInfo.value = user;

      Cookies.set("_authToken", code, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });

      await insertUser(userInfo.value.login, userInfo.value.image.link, code);
      window.location.href = "/Profile";
    }
    else {
      router.push('/');
    }
  }
  catch (error) {
    console.log(error);
    router.push('/');
  }

});

onUnmounted(() => {
  if (imageSrc.value) {
    URL.revokeObjectURL(imageSrc.value);
  }
});

</script>

<template>
  <!-- <img :src="imageSrc" /> -->
</template>