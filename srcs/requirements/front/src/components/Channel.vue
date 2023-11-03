<script setup>
	import Cookies from "js-cookie";
	import { getUserByCookie, getAllMessagesFromChannel, getAllUsersFromChannel } from './api/get.call';
	import { onMounted, ref } from 'vue'; 
	import { useRoute } from 'vue-router';

	let messages = ref([]);
	let user = ref(null);
	let users = ref([]);

	const route = useRoute();

	onMounted(async () => {
		user = await getUserByCookie(Cookies.get("_authToken"));
		if (!user) {
			window.location.href = "/";
		}

		users = await getAllUsersFromChannel(route.params.channelName);
		messages = await getAllMessagesFromChannel(route.params.channelName);

		console.log(users);
		console.log(messages);
	});
</script>


<template>
  <div>
    <div class="navbar bg-base-100">
      <a class="btn btn-ghost normal-case text-xl">{{ $route.params.channelName }}</a>
    </div>
    <div class="flex">
      <ul class="menu bg-base-200 w-56 rounded-box">
        <li v-for="(user, index) in users" :key="index">
          <a> {{ user.userName }} </a>
        </li>
      </ul>
    </div>
  </div>

</template>