<script>
	export default {
		name: 'UserStatHeader',
		props: {
			userName: String,
			gamePlayed: Number,
			gameWon: Number,
		},
	};
</script>

<template>
	<div class="stats shadow flex flex-row">
		<div class="stat">
			<div class="stat-title">Username</div>
			<div class="stat-value">{{ userName }}</div>
		</div>

		<div class="stat">
			<div class="stat-title">Games Total</div>
			<div class="stat-value">{{ gamePlayed }}</div>
		</div>

		<div class="stat">
			<div class="stat-title">Games won</div>
			<div class="stat-value">{{ gameWon }}</div>
		</div>

		<div class="stat">
			<div class="stat-title">Winrate</div>
			<div v-if="gamePlayed != 0" class="stat-value"> {{ ((gameWon / gamePlayed) * 100).toPrecision(4) }}  % </div>
			<div v-else class="stat-value">{{ 100 }} % </div>        
		</div>
	</div>
</template>
