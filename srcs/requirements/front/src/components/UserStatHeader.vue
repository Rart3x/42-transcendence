<script>
	export default {
		name: 'UserStatHeader',
		props: {
			userName: String,
			gamePlayed: Number,
			gameWon: Number,
		},
		computed: {
			winrate() {
				return this.gamePlayed !== 0 ? (this.gameWon / this.gamePlayed) * 100 : 100;
			},
		},
	};
</script>

<template>
	<div class="stats shadow flex flex-row font-mono">
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
			<div v-if="gamePlayed != 0" class="stat-value">
				<div v-if="winrate.toFixed(0) >= 50" class="stat-value text-green-500"> {{ winrate.toFixed(2) }} % </div>
				<div v-if="(winrate.toFixed(0) < 50 && winrate.toFixed(0) >= 30)" class="stat-value text-yellow-500"> {{ winrate.toFixed(2) }} % </div>
				<div v-if="(winrate.toFixed(0) < 30)" class="stat-value text-red-500"> {{ winrate.toFixed(2) }} % </div>
			</div>
			<div v-else class="stat-value text-green-500">{{ 100 }} % </div>        
		</div>
	</div>
</template>

<style scoped>
  .stats { border-radius: unset; position: sticky;}
</style>