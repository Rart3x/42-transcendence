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

	let userImages = ref([]);
	let message_text = ref('');

	const route = useRoute();

	const filteredUsers = computed(() => {
  	return users.value.filter(user => actualUser.value.userName !== user.userName);
	});

	const sendMessage = async () => {
		if (message_text.value) {
			await insertMessageToChannel(route.params.channelName, message_text.value, actualUser.value.userName);
			messages.value = await getAllMessagesFromChannel(route.params.channelName);
			message_text.value = '';
		}
	};

	onMounted(async () => {
		actualUser.value = await getUserByCookie(Cookies.get("_authToken"));

		if (!actualUser.value)
			window.location.href = "/";

		channel.value = await getChannelByChannelName(route.params.channelName);

		let usersData = await getAllUsersFromChannel(route.params.channelName);
		for (let user of usersData) {
			let imagePath = "../assets/userImages/" + user.image;
			await import(/* @vite-ignore */ imagePath).then((image) => {
				user.imageSrc = image.default;
			});
		}

 		users.value.splice(0, users.value.length, ...usersData);
		messages.value = await getAllMessagesFromChannel(route.params.channelName);
	});

</script>

<template>
	<link href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css" rel="stylesheet" type="text/css" />
  <div class="navbar bg-base-100">
    <button class="btn btn-ghost normal-case text-xl"> {{ $route.params.channelName }} </button>
  </div>
	<div class="overflow-x-auto">
		<div class="grid-container">
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
							<td>
								<input type="text" class="input input-bordered w-full max-w-xs" id="message_text" @keyup.enter="sendMessage(message_text)" placeholder="Send Message" v-model="message_text"/>
							</td>
							<td v-if="channel.channelAdmin == actualUser.userId">
								<button class="btn btn-error" @click="removeFriendFromChannel($route.params.channelName, user.userName)">Kick</button>
							</td>
						</tr>
				</tbody>
			</table>
		</div>
	</div>
	<!--Chat Facebook, a voir un peu apres-->

	<!-- <div class="chat-box">
    <div class="chat-header">
      <h2>Chat Box</h2>
      <button @click="closeChat">X</button>
    </div>
    <div class="chat-messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
				<div v-if="message">
        	{{ message }}
				</div>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div> -->
</template>

<style scoped>
	.chat-box {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 300px;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	.chat-header {
		background-color: #0084ff;
		color: #fff;
		padding: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.chat-messages {
		max-height: 200px;
		overflow-y: auto;
		padding: 10px;
	}

	.chat-input {
		display: flex;
		align-items: center;
		padding: 10px;
	}

	/* input {
		flex: 1;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
	} */

	.message {
		margin: 5px 0;
		padding: 5px;
		background-color: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.grid-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		height: 10vh;
	}

	tbody tr:hover {
		background-color: #efefef;
	}

	.dark-row:hover {
		background-color: #364e6e;
	}
</style>