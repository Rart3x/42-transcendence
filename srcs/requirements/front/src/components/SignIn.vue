<script setup>
import Cookies from "js-cookie";
import { ref, onMounted, onUnmounted } from "vue";
import { insertUser } from './api/post.call.ts';
import { useRouter } from "vue-router";

const userInfo = ref(null);
const imageSrc = ref(null);

const code = new URL(window.location.href).searchParams.get("code");

onMounted(async () => {
  const router = useRouter();
  try {
    if (code || Cookies.get("userLogin")) {
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

      // // Convert the image URL to bytes
      userInfo.value = user;
      console.log(userInfo.value);
      // const imageResponse = await fetch(userInfo.value.image.link);
      // if (!imageResponse.ok) {
      //   throw new Error(`HTTP error! status: ${imageResponse.status}`);
      // }
      // const imageBlob = await imageResponse.blob();
      // const imageBytes = await new Response(imageBlob).arrayBuffer();

      // // Convert the bytes to base64 string
      // const base64Image= btoa(new Uint8Array(imageBytes).reduce(function (data, byte) {
      //   return data + String.fromCharCode(byte);
      // }, ''));

      Cookies.set("userLogin", user.login, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });
      insertUser(userInfo.value.login, userInfo.value.image.link);

      // Change string to bytes and recreate image
      // const binaryImage = atob(base64Image);
      // const reversedImageBytes = new Uint8Array(binaryImage.length);

      // for (let i = 0; i < binaryImage.length; i++) {
      //   reversedImageBytes[i] = binaryImage.charCodeAt(i);
      // }
      // imageSrc.value = URL.createObjectURL(new Blob([reversedImageBytes], { type: 'image/jpeg' }));
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