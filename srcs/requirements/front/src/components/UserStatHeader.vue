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
<<<<<<< HEAD
			<div v-if="gamePlayed != 0" class="stat-value">
				<div v-if="winrate.toFixed(0) >= 50" class="stat-value text-green-500"> {{ winrate.toFixed(2) }} % </div>
				<div v-if="(winrate.toFixed(0) < 50 && winrate.toFixed(0) >= 30)" class="stat-value text-yellow-500"> {{ winrate.toFixed(2) }} % </div>
				<div v-if="(winrate.toFixed(0) < 30)" class="stat-value text-red-500"> {{ winrate.toFixed(2) }} % </div>
			</div>
=======
			<div v-if="gamePlayed != 0" class="stat-value"> {{ ((gameWon / gamePlayed) * 100).toPrecision(4) }}  % </div>
>>>>>>> e2af10f03d8f71875fa9bc0b85847111fcf33182
			<div v-else class="stat-value">{{ 100 }} % </div>        
		</div>
	</div>
</template>
