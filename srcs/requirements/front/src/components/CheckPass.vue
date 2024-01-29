<script setup>
  import Alert from './Alert.vue';
  import Cookies from "js-cookie";
  import Modal from './Modal.vue';
  import sha256 from 'js-sha256';
  import { ref, onMounted } from 'vue';
  import { getUsersFromChannel, getUserByUserId } from './api/get.call';
  import { checkPass, joinChannel } from './api/post.call';
  import { useRoute, useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  
  const checkPassFailed = ref(false);
  const password = ref('');

  const route = useRoute();
  const router = useRouter();
  const store = useStore();

  let modalCheckPass = ref(false);

  let cookieJWT = ref(null);
  let user = ref(null);

  const checkPassInDB = async (password) => {
    const hashedPassword = sha256(password);
    const response = await checkPass(route.params.channelName, hashedPassword, cookieJWT.value);
    
    if (response && response.success){
      modalCheckPass.value = false;
      await joinChannel(route.params.channelName, user.value.userName, cookieJWT.value);
      const channelUsers = await getUsersFromChannel(route.params.channelName, cookieJWT.value);
      for (let i = 0; i < channelUsers.length; i++) {
        if (channelUsers[i].status === 'online')
          await store.dispatch('newChannelMember', { socket: channelUsers[i].socket })
      }

      router.push(`/channel/${route.params.channelName}`);
    }
    else { 
      checkPassFailed.value = true;
      setTimeout(() => {
        checkPassFailed.value = false;
      }, 3000);
    }
  };

  onMounted(async () => { 
    cookieJWT.value  = Cookies.get('Bearer');
    let cookieUserId = Cookies.get('UserId');

    if (cookieJWT.value && cookieUserId) {
      user.value = await getUserByUserId(cookieUserId, cookieJWT.value);
    }

    modalCheckPass.value = true;
  });
</script>

<template>
  <Alert :checkPassFailed="checkPassFailed" />
  <Modal :checkPassInDB="checkPassInDB" :modalCheckPass="modalCheckPass" :parent="'checkPass'" /> 
  <body class="overflow-x-auto min-h-screen bg-base-200 pass"> </body>
</template>