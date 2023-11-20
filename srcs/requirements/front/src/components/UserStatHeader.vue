<script>
	export default {
		name: 'UserStatHeader',
		props: {
			userName: String,
		},
	};
</script>

<template>
    <div class="stats shadow">
        <div class="stat">
        <div class="stat-figure text-primary">
        </div>
        <div class="stat-title">Username</div>
        <div class="stat-value">{{ userName }}</div>
        </div>

        <div class="stat">
        <div class="stat-figure text-primary">
        </div>
        <div class="stat-title">Games Total</div>
        <div class="stat-value">0</div>
        </div>

        <div class="stat">
        <div class="stat-figure text-secondary">
        </div>
        <div class="stat-title">Games won</div>
        <div class="stat-value">0</div>
        </div>

        <div class="stat">
        <div class="stat-figure text-secondary">
        </div>
        <div class="stat-title">Winrate</div>
        <div class="stat-value">0%</div>
        </div>
    </div>
</template>
