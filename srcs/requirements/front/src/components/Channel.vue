<script setup>
import Cookies from "js-cookie";
import { getAllMessagesFromChannel, getAllUsersFromChannel, getUserByCookie } from './api/get.call';
import { onMounted, ref } from 'vue'; 
import { useRoute } from 'vue-router';

let messages = ref([]);
let user = ref(null);
let users = ref([]);

let isDropdownVisible = ref(false);

const route = useRoute();

onMounted(async () => {
	user.value = await getUserByCookie(Cookies.get("_authToken"));

	if (!user.value)
	window.location.href = "/";	

	//Splice is used to replace the array with the new one
	users.value.splice(0, users.value.length, ...(await getAllUsersFromChannel(route.params.channelName)));
	//That is why request appear instantly now
	messages.value = await getAllMessagesFromChannel(route.params.channelName);
});

</script>

<template>
	<div>
		<div class="navbar bg-base-100">
			<button class="btn btn-ghost normal-case text-xl"> {{ $route.params.channelName }} </button>
			<ul>
				<li>test</li>
			</ul>
			<div>
				<ul>
					<li v-for="(user, index) in users" :key="index">
						<router-link :to="'/profile/' + user.userName">{{ user.userName }}</router-link>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>