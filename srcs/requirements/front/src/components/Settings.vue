<script>
import Cookies from 'js-cookie';
import qrcode from 'qrcode';
import UserStatHeader from './UserStatHeader.vue';
import { updateImage, updateUsername, updateA2F } from './api/post.call';
import { getUserByUserId } from './api/get.call';

export default {
 components: {
   UserStatHeader
 },
 data() {
   return {
     dataURL: null,
	 selectedFile: null,
     user: null,
     newUserName: "",
     userName: "",
     A2FEnabled: false,
     activeTab: "username",
     cookieJWT: null,
   };
 },
 methods: {
	async changeA2F(){
		this.user.A2F = !this.user.A2F;
		this.user = await updateA2F(this.user.userName, user.A2F, this.cookieJWT);
		this.dataURL = ref(null);
		if (this.user.A2F)
			this.dataURL = await qrcode.tothis.DataURL(this.user.A2FUrl);
		this.A2FEnabled = this.user.A2F;
	},
	async handleSubmit(){
		if (!this.newUserName || this.newUserNamelength > 20 || this.newUserNamelength < 3 || !/^[A-Za-z0-9_\-]+$/.test(this.newUserName)) {
			alert('Invalid username');
			return;
		}
		await updateUsername(this.user.userName, this.newUserName, this.cookieJWT);
		this.newUserName = '';
		// window.location.reload();
	},
	onFileChange(event){
		this.selectedFile = event.target.files[0];
	},
	showContent(tab){
		this.activeTab = tab;
	},
	async uploadImage(){
		if (!this.selectedFile) {
			alert('Please select a file');
			return;
		}
		const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (!allowedFileTypes.includes(this.selectedFile.type)) {
			alert('Invalid file type');
			return;
		}
		const fileSizeInBytes = this.selectedFile.size;
		const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
		const sizeLimit = 1; // Limit in MB
		if (fileSizeInMB > sizeLimit) {
			alert(`File size should not exceed ${sizeLimit}MB`);
			return;
		}
		await updateImage(this.user.userName, this.selectedFile, this.cookieJWT);
		window.location.reload(); // Refresh the page but ugly
	}
<<<<<<< HEAD
 },
 async mounted() {
   let cookieUserId = Cookies.get('UserId');
   this.cookieJWT = Cookies.get('Bearer');
   if (this.cookieUserId != 'undefined' && this.cookieJWT != 'undefined'){
     this.user = await getUserByUserId(cookieUserId, this.cookieJWT);
     if (!this.user){
       window.location.href = "/";
     }
     this.userName = this.user.displayName;
     if (this.user.A2F)
       this.this.dataURL = await qrcode.tothis.DataURL(this.user.A2FUrl);
     this.A2FEnabled = this.user.A2F;
   }
 }
};
=======

	onMounted(async () => {
		let cookieUserId = Cookies.get('UserId');
		cookieJWT.value = Cookies.get('Bearer');
		if (typeof cookieUserId !== 'undefined' && typeof cookieJWT.value !== 'undefined'){
			user.value = await getUserByUserId(cookieUserId, cookieJWT.value);
			// if (!user.value){
			// 	window.location.href = "/";
			// }
			userName.value = user.value.displayName;
			if (user.value.A2F)
				dataURL.value = await qrcode.toDataURL(user.value.A2FUrl);
			A2FEnabled.value = user.value.A2F;
		}
	});
>>>>>>> 7d8a7c808419b4d852c6568ddb10427e5ade436f
</script>

<template>
	<div class="overflow-x-auto min-h-screen bg-base-200">
	<UserStatHeader v-if="user" :userName="user.userName" :gamePlayed="user.gamePlayed" :gameWon="user.gameWon" />
		<div class="buttons bg-base-200">
			<button class="btn glass" @click="showContent('username')">Change username</button>
			<button class="btn glass" @click="showContent('image')">Change image</button>
			<button class="btn glass" @click="showContent('2FA')">2FA</button>
		</div>
		<br><br>
		<div class="content">
			<div v-if="activeTab === 'username'">
				<form @submit.prevent="handleSubmit()">
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
				<img v-if="this.dataURL" :src="this.dataURL" class="qrcode" />
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
