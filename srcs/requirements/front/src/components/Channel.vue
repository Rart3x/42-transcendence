<script setup>
	import Cookies from "js-cookie";
	import { getAllMessagesFromChannel, getAllUsersFromChannel, getUserByCookie } from './api/get.call';
	import { computed, onMounted, ref } from 'vue'; 
	import { useRoute } from 'vue-router';

	let messages = ref([]);
	let actualUser = ref(null);
	let users = ref([]);

	const route = useRoute();

	onMounted(async () => {
		actualUser.value = await getUserByCookie(Cookies.get("_authToken"));

		if (!actualUser.value)
		window.location.href = "/";	

		users.value.splice(0, users.value.length, ...(await getAllUsersFromChannel(route.params.channelName)));
		messages.value = await getAllMessagesFromChannel(route.params.channelName);
	});

	const filteredUsers = computed(() => {
  	return users.value.filter(user => actualUser.value.userName !== user.userName);
	});

</script>

<template>
	<link href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css" rel="stylesheet" type="text/css" />
  <div class="navbar bg-base-100">
    <button class="btn btn-ghost normal-case text-xl">{{ $route.params.channelName }}</button>
  </div>
	<div class="overflow-x-auto">
		<div class="grid-container">
			<table class="table table-zebra">
				<tbody v-for="user in filteredUsers" :key="user.userName">
					<tr class="dark-row">
						<td>
							<router-link :to="'/profile/' + user.userName"> {{ user.userName }} </router-link>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<style scoped>
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