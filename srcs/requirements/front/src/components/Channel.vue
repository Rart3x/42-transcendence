<script setup>
	import Cookies from "js-cookie";
	import { removeFriendFromChannel } from './api/delete.call';
	import { getAllMessagesFromChannel, getAllUsersFromChannel, getChannelByChannelName, getUserByCookie } from './api/get.call';
	import { insertMessageToChannel } from './api/post.call';
	import { computed, onMounted, ref } from 'vue'; 
	import { useRoute } from 'vue-router';

	let actualUser = ref(null);
	let channel = ref(null);
	let messages = ref([]);
	let users = ref([]);

	let message_text = ref('');

	const route = useRoute();

	const filteredUsers = computed(() => {
  	return users.value.filter(user => actualUser.value.userName !== user.userName);
	});

	const sendMessage = async () => {
		if (message_text.value) {
			await insertMessageToChannel(route.params.channelName, message_text.value, actualUser.value);
			messages.value = await getAllMessagesFromChannel(route.params.channelName);
			message_text.value = '';
		}
	};

	onMounted(async () => {
		actualUser.value = await getUserByCookie(Cookies.get("_authToken"));

		if (!actualUser.value)
			window.location.href = "/";

		channel.value = await getChannelByChannelName(route.params.channelName);

		if (actualUser.value.image) {
			let userImagePath = "../assets/userImages/" + actualUser.value.image;
			await import(/* @vite-ignore */ userImagePath).then((userImage) => {
				actualUser.value.image = userImage.default;
			});
		}

		let usersData = await getAllUsersFromChannel(route.params.channelName);
		for (let user of usersData) {
			let imagePath = "../assets/userImages/" + user.image;
			await import(/* @vite-ignore */ imagePath).then((image) => {
				user.imageSrc = image.default;
			});
		}

		messages.value = await getAllMessagesFromChannel(route.params.channelName);

		for (let message of messages.value) {
			if (message.sender) {
				let imagePath = "../assets/userImages/" + message.sender.image;
				await import(/* @vite-ignore */ imagePath).then((image) => {
					message.sender.image = image.default;
				});
			}
		}
		users.value.splice(0, users.value.length, ...usersData);

	});

</script>

<template>
	<div class="navbar bg-base-100">
		<button class="btn btn-ghost normal-case text-xl">{{ $route.params.channelName }}</button>
	</div>
  <div class="grid-container">
    <div class="overflow-x-auto">
			<div class="friend-list">
				<table class="table table-zebra">
					<tbody v-for="user in filteredUsers" :key="user.userName">
						<tr class="dark-row">
							<td>
								<label tabindex="0" class="btn btn-ghost btn-circle">
									<div class="avatar">
										<div class="w-24 mask mask-squircle">
											<img :src="user.imageSrc" />
										</div>
									</div>
								</label>
							</td>
							<td>
								<router-link :to="'/profile/' + user.userName">
									<button class="btn no-animation">{{ user.userName }}</button>
								</router-link>
							</td>
							<td v-if="channel.channelAdmin == actualUser.userId">
								<button class="btn btn-error" @click="removeFriendFromChannel($route.params.channelName, user.userName)">Kick</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
    </div>
    <!-- Center Chat on mid Grid -->
    <!-- Penser a ajouter lhoraire denvoi et aussi le focus de la navabar en bas de la box-->
		<div class="chat-box" style="text-align: center;">
			<div class="chat-messages">
				<div v-for="(message, index) in messages" :key="index" class="message">
					<div class="message-row">
						<div v-if="message.userId !== actualUser.userId">
							<p>{{ message.sender.userName }}</p>
							<div class="chat chat-start">
								<label tabindex="0" class="btn btn-ghost btn-circle">
								<div class="avatar">
										<div class="w-24 mask mask-squircle">
											<img :src="message.sender.image" />
										</div>
									</div>
								</label>
								<div class="chat-bubble">{{ message.message_text }}</div>
							</div>
						</div>
						<div v-if="message.userId === actualUser.userId">
							<div class="chat chat-end">
								<div class="chat-bubble">{{ message.message_text }}</div>
								<label tabindex="0" class="btn btn-ghost btn-circle">
									<div class="avatar">
										<div class="w-24 mask mask-squircle">
											<img :src="actualUser.image" />
										</div>
									</div>
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="chat-input">
				<input type="text" class="input input-bordered w-full max-w-xs" id="message_text" @keyup.enter="sendMessage(message_text)" placeholder="Send Message" v-model="message_text" />
				<button class="btn btn-primary" @click="sendMessage">Send</button>
			</div>
		</div>		
	</div>		
</template>

<style scoped>
	.chat-messages {
    max-height: 55vh;
    overflow-x: auto;
  }
  .chat-messages::-webkit-scrollbar-thumb {
    background: #888;
  }
  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  .chat-messages::-webkit-scrollbar-track {
    background: #ddd;
  }

	.friend-list {
    max-height: 55vh;
    overflow-x: auto;
  }
  .friend-list::-webkit-scrollbar-thumb {
    background: #888;
  }
  .friend-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  .friend-list::-webkit-scrollbar-track {
    background: #ddd;
  }

	.dark-row:hover {
		background-color: #364e6e;
	}
	.grid-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		height: 10vh;
	}
	tbody tr:hover {
		background-color: #efefef;
	}
</style>