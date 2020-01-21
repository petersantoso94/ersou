<template>
	<v-card>
		<v-card-title class="headline">{{detail.title}}</v-card-title>
	</v-card>
</template>

<script>
import EventBus from "../utils/event-bus";
export default {
	props: ["detail"]
};
</script>

<style>
</style>