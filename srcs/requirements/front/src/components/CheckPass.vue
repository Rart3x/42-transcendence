<script setup>
	import sha256 from 'js-sha256';
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
      modalManageChannel.value.open = false;
      router.push(`/channel/${route.params.channelName}`);
    }
    else { 
      checkPassFailed.value = true;
      setTimeout(() => {
        checkPassFailed.value = false;
      }, 3000);
    }
  };	

  onMounted(() => {
    if (modalManageChannel.value) {
      modalManageChannel.value.show();
    }
  });
</script>

<template>
  <dialog ref="modalManageChannel" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box w-11/12 max-w-5xl">
		<form class="dialogModalChannel" @submit.prevent="checkPassInDB(password)">
			<label>Enter <b>{{ $route.params.channelName }}</b> password</label><br><br>
			<input type="text" placeholder="Password" v-model="password" class="input input-bordered input-sm w-full max-w-xs" />
			<br><br>
			<button class="btn">Submit</button>
		</form>
	</div>
	</dialog>

  <div class="background"></div>

  <div v-if="checkPassFailed" class="toast toast-start">
    <div class="alert alert-error">
      <span>Invalid Password</span>
    </div>
  </div>

</template>

<style scoped>
	.dialogModalChannel {
		text-align: center;
	}
</style>