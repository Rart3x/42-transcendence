<script setup>
	import sha256 from 'js-sha256';
  import Alert from './Alert.vue';
  import Modal from './Modal.vue';
  import { onMounted, ref } from 'vue'
	import { checkPass } from './api/post.call';
	import { useRoute, useRouter } from 'vue-router';

	const modalManageChannel = ref(null);
  const password = ref('');

  let checkPassFailed = ref(false);

  const route = useRoute();
  const router = useRouter();

  const checkPassInDB = async () => {
    const hashedPassword = sha256(password.value);
    const response = await checkPass(route.params.channelName, hashedPassword);
    
    if (response && response.success){
      modalCheckPass.value.open = false;
      router.push(`/channel/${route.params.channelName}`);
    }
    else { 
      checkPassFailed.value = true;
      setTimeout(() => {
        checkPassFailed.value = false;
      }, 3000);
    }
  };
  
  // const closeModal = () => { modalCheckPass.value.open = false;};

  onMounted(() => {
    // if (modalCheckPass.value)
      // modalCheckPass.value.show();
  });
</script>

<template>
  <Alert :checkPassFailed="checkPassFailed" />
  <Modal :checkPassInDB="checkPassInDB" /> 
  <body class="overflow-x-auto min-h-screen bg-base-200 pass">
  </body>

</template>

<style scoped>
  body { backdrop-filter: blur(5px); }
</style>