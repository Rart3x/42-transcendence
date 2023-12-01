<script setup>
	import UserStatHeader from './UserStatHeader.vue';
	import { updateImage, updateUsername, updateA2F } from './api/post.call';
	import { getUserByCookie } from './api/get.call';
	import { onMounted, ref } from 'vue';
	import Cookies from 'js-cookie';
	import qrcode from 'qrcode';

	let dataURL = ref(null);
	let selectedFile = ref(null);
	let user = ref(null);

	let newUserName = ref("");
	let userName = ref("");

	let A2FEnabled = ref(false);

	let activeTab = ref("username");

	const changeA2F = async () => {
		user.value.A2F = !user.value.A2F;
		user.value = await updateA2F(user.value.userName, user.value.A2F);
		dataURL = ref(null);
		if (user.value.A2F)
				dataURL.value = await qrcode.toDataURL(user.value.A2FUrl);
		A2FEnabled.value = user.value.A2F;
	}

	const handleSubmit = async () => {
		if (!newUserName.value || newUserName.value.length > 20 || newUserName.value.length < 3 || !/^[A-Za-z0-9_\-]+$/.test(newUserName.value)) {
				alert('Invalid username');
				return;
		}

		await updateUsername(user.value.userName, newUserName.value);
		window.location.href = "/settings";
	}

	const onFileChange = (event) => { selectedFile.value = event.target.files[0] }
	const showContent = (tab) => { activeTab.value = tab; };

	const uploadImage = async () => {
		if (!selectedFile.value) {
			alert('Please select a file');
			return;
		}

		const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (!allowedFileTypes.includes(selectedFile.value.type)) {
			alert('Invalid file type');
			return;
		}

		const fileSizeInBytes = selectedFile.value.size;
		const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
		const sizeLimit = 1; // Limit in MB

		if (fileSizeInMB > sizeLimit) {
			alert(`File size should not exceed ${sizeLimit}MB`);
			return;
		}

		await updateImage(user.value.userName, selectedFile.value);
	}

	onMounted(async () => {
		user.value = await getUserByCookie(Cookies.get("_authToken"));
		if (!user.value)
			window.location.href = "/";
		userName.value = user.value.displayName;
		if (user.value.A2F)
			dataURL.value = await qrcode.toDataURL(user.value.A2FUrl);
		A2FEnabled.value = user.value.A2F;
	});
</script>

<template>
	<UserStatHeader v-if="user" :userName="user.userName" :gamePlayed="user.gamePlayed" :gameWon="user.gameWon" />
	<div class="overflow-x-auto min-h-screen bg-base-200">
		<div class="buttons bg-base-200">
			<button class="btn glass" @click="showContent('username')">Change username</button>
			<button class="btn glass" @click="showContent('image')">Change image</button>
			<button class="btn glass" @click="showContent('2FA')">2FA</button>
		</div>
		<br><br>
		<div class="content">
			<div v-if="activeTab === 'username'">
				<form @submit.prevent="handleSubmit">
					<input type="text" id="newUserName" v-model="newUserName" :placeholder="userName" class="input input-bordered w-full max-w-xs" maxlength="20" pattern="^[A-Za-z0-9_\-]+$" />
					<button class="btn glass">Send</button>
				</form>
			</div>
			<div v-if="activeTab === 'image'">
				<input type="file" class="file-input file-input-bordered w-full max-w-xs" @change="onFileChange" />
				<button class="btn glass" @click="uploadImage">Upload</button>
			</div>
			<div v-if="activeTab === '2FA'">
				<div class="button-container">
					<button v-if="A2FEnabled" class="btn glass btn-error" @click="changeA2F">Disable</button>
					<button v-else class="btn glass btn-success" @click="changeA2F">Enable</button>
				</div>
				<br><br>
				<img v-if="dataURL" :src="dataURL" class="qrcode" />
			</div>
		</div>
	</div>
</template>

<style>
	form { text-align: center; }
	label { text-align: center; }
	
	.button-container { display: flex; justify-content: center; }
	.buttons { text-align: center; }
	.content { display: flex; flex-direction: column; align-items: center; }
	.stats { border-radius: unset; }
	.qrcode { display: flex; flex-direction: column; align-items: center; }
</style>