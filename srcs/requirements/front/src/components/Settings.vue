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
	 theme: 'dark'
   };
 },
 methods: {
	toggleTheme() {
     this.theme = this.theme === 'dark' ? 'night' : 'dark';
     document.documentElement.setAttribute('data-theme', this.theme);
   },
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
</script>
Cog-icon-grey.svg
<template>
	<div class="grid h-screen place-items-center grid-cols-1 bg-base-200 shadow border-2 border-gray-500">
		<div class="flex flex-col items-center">
			<label class="block text-base font-medium">Username</label>
			<input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
		</div>
		<div class="flex flex-col items-center">
			<label class="block text-base font-medium">Image</label>
			<input type="file" class="file-input file-input-bordered w-full max-w-xs">
			<button class="btn btn-success" @click="uploadImage">Upload</button>
		</div>
		<div>
			<label for="enable2FA" class="text-base font-medium">Two-Factor Authentication (2FA)</label>
			<div class="flex flex-col items-center">
				<button v-if="A2FEnabled" class="btn btn-error ml-4" @click="changeA2F">Disable</button>
				<button v-else class="btn btn-success ml-4" @click="changeA2F">Enable</button>
			</div>
		</div>
		<div class="text-right">
			<button class="btn btn-danger ml-4" @click="deleteAccount">Delete Account</button>
			<button type="submit" class="btn btn-primary" @click="saveAll">Save All</button>
			<button class="btn btn-secondary ml-4" @click="toggleTheme">Switch Theme</button>
		</div>
	</div>
<!-- 
	<div class="grid grid-cols-1 min-h-screen bg-base-200 flex justify-center">
		<h1 class="text-3xl font-bold">Settings</h1>
		<div class="shadow overflow-hidden">
			<div class="col-start-1">
				<label for="newUserName" class="text-sm font-medium text-gray-700">Username</label>
				<input type="text" id="newUserName" v-model="newUserName" :placeholder="userName" class="input input-bordered w-full max-w-xs mt-1" />
			</div>
			<div class="col-start-2">
				<label for="fileInput" class="text-sm font-medium text-gray-700">Profile Image</label>
				<input type="file" id="fileInput" class="file-input file-input-bordered w-full max-w-xs mt-1" @change="onFileChange" />
			</div>
			<div class="col-start-3">
				<label for="enable2FA" class="text-sm font-medium text-gray-700">Two-Factor Authentication (2FA)</label>
				<div class="flex items-center">
					<button v-if="A2FEnabled" class="btn btn-error ml-4" @click="changeA2F">Disable</button>
					<button v-else class="btn btn-success ml-4" @click="changeA2F">Enable</button>
				</div>
			</div>
		</div>
		<div class="col-start-4 text-right">

		</div>
	</div> -->
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
