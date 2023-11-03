<template>
	<div>
		<div class="navbar bg-base-100">
			<a class="btn btn-ghost normal-case text-xl">{{ $route.params.channelName }}</a>
		</div>
	</div>
</template>

<script>
	export default {
	name: "Channel",
	};
</script>