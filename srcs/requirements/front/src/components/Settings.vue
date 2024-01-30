<script>
	import Alert from './Alert.vue';
	import Cookies from 'js-cookie';
	import qrcode from 'qrcode';
	import UserStatHeader from './UserStatHeader.vue';
	import { getUserByUserId, getUserByDisplayName, getUserByUserName, getAllUsers } from './api/get.call';
	import { updateImage, updateUsername, updateA2F } from './api/post.call';
	import { deleteUser } from './api/delete.call';
	import EventBus from '../services/event-bus.ts';
	import { useStore } from 'vuex';

	export default {
		components: {
			Alert,
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
				theme: 'dark',
				userNameAlreadyTaken: false,
				store : useStore(),
			};
		},
		methods: {
			toggleTheme() {
				this.theme = this.theme === 'dark' ? 'night' : 'dark';
				document.documentElement.setAttribute('data-theme', this.theme);
				localStorage.setItem('theme', this.theme);
			},
			async changeA2F(){
				this.user.A2F = !this.user.A2F;
				this.user = await updateA2F(this.user.userName, this.user.A2F, this.cookieJWT);
				this.dataURL = null;
				if (this.user.A2F)
					this.dataURL = await qrcode.toDataURL(this.user.A2FUrl);
				this.A2FEnabled = this.user.A2F;
			},
			async handleSubmit(){
				if (!this.newUserName || this.newUserName.length > 20 || this.newUserName.length < 3 
					|| !/^[A-Za-z0-9_\-]+$/.test(this.newUserName)) {
					alert('error: invalid username');
					return;
				}
				const user1 = await getUserByUserName(this.newUserName, this.cookieJWT);
				const user2 = await getUserByDisplayName(this.newUserName, this.cookieJWT);

				if (user1 || user2) {
					this.userNameAlreadyTaken = true;
					setTimeout(() => { this.userNameAlreadyTaken = false; }, 3000);
				}
				else if (!user1 && !user2) {
					await updateUsername(this.user.userName, this.newUserName, this.cookieJWT);
				}
				window.location.reload();
				this.newUserName = '';
			},
			onFileChange(event){
				this.selectedFile = event.target.files[0];
			},
			async saveAll(){
				if (this.newUserName)
					this.handleSubmit();
				if (this.selectedFile)
					this.uploadImage();
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
				const sizeLimit = 1;
				if (fileSizeInMB > sizeLimit) {
					alert(`File size should not exceed ${sizeLimit}MB`);
					return;
				}
				await updateImage(this.user.userName, this.selectedFile, this.cookieJWT);
				window.location.reload();
			}
		},
		async mounted() {
			let cookieUserId = Cookies.get('UserId');
			this.cookieJWT = Cookies.get('Bearer');

			const allUsers = await getAllUsers(this.cookieJWT);
			for (let i = 0; i < allUsers.length; i++) {
				if (allUsers[i].status === 'online' && allUsers[i].userId !== cookieUserId) {
					this.store.dispatch('newUser', { socket: allUsers[i].socket });
				}
			}

			if (typeof cookieUserId !== 'undefined' && typeof this.cookieJWT !== 'undefined') {
				this.user = await getUserByUserId(cookieUserId, this.cookieJWT);
				if (!this.user)
					window.location.href = "/";
				this.userName = this.user.userName;
				if (this.user.A2F) { 
					this.dataURL = await qrcode.toDataURL(this.user.A2FUrl);
					this.A2FEnabled = this.user.A2F;
				}
			}
			const eventBus = EventBus.getInstance();
			eventBus.emit("refreshHeader");
		}
	};
</script>

<template>
	<Alert :userNameAlreadyTaken="userNameAlreadyTaken" />
	<UserStatHeader v-if="user"
		:userName="userName"
		:gamePlayed="user.gamePlayed"
		:gameWon="user.gameWon"
  	/>
	<div class="flex flex-col gap-y-8 min-h-[calc(100vh-210px)] bg-base-200 overflow-auto font-mono place-items-center">
		<div class="items-center">
			<span class="block text-base font-medium">Username</span>
			<input type="text" id="newUserName" v-model="newUserName" :placeholder="userName" class="input input-bordered w-full max-w-xs mt-1" maxlength="20" pattern="^[A-Za-z0-9_"/>
		</div>
		<div class="items-center">
			<span class="block text-base font-medium">Image</span>
			<input type="file" class="file-input file-input-bordered w-full max-w-xs" @change="onFileChange">
		</div>
		<div class="items-center">
			<span for="enable2FA" class="text-base font-medium">Two-Factor Authentication (2FA)</span>
			<div>
				<button v-if="A2FEnabled" class="btn btn-error" @click="changeA2F">Disable</button>
				<button v-else class="btn btn-success" @click="changeA2F">Enable</button>
			</div>
		</div>
		<img v-if="dataURL" :src="dataURL" class="qrcode col-start-2"/>
		<div class="flex justify-end">
			<button type="submit" class="btn btn-primary" @click="saveAll">Apply</button>
			<button class="btn btn-secondary ml-2" @click="toggleTheme">Switch Theme</button>
		</div>
	</div>
</template>

<style>
	.items-center { margin-top: 1.5rem; margin-bottom: 1.5rem; text-align: center;}
	.qrcode { display: flex; flex-direction: column; align-items: center; }
</style>
