<script setup>
  import Alert from './Alert.vue';
  import Modal from './Modal.vue';
  import sha256 from 'js-sha256';
  import { ref, onMounted } from 'vue';
  import { checkPass } from './api/post.call';
  import { useRoute, useRouter } from 'vue-router';
  
  const password = ref('');
  const checkPassFailed = ref(false);

  const route = useRoute();
  const router = useRouter();

  let modalCheckPass = ref(false);

  const checkPassInDB = async (password) => {
    const hashedPassword = sha256(password);
    const response = await checkPass(route.params.channelName, hashedPassword);
    
    if (response && response.success){
      modalCheckPass.value = false;
      router.push(`/channel/${route.params.channelName}`);
    }
    else { 
      checkPassFailed.value = true;
      setTimeout(() => {
        checkPassFailed.value = false;
      }, 3000);
    }
  };
  
  onMounted(() => { modalCheckPass.value = true; });
</script>

<template>
  <Alert :checkPassFailed="checkPassFailed" />
  <Modal :checkPassInDB="checkPassInDB" :modalCheckPass="modalCheckPass" :parent="'checkPass'" /> 
  <body class="overflow-x-auto min-h-screen bg-base-200 pass"> </body>
</template>

<style scoped>
  body { backdrop-filter: blur(5px); }
</style>