<template>
	<v-card>
		<v-card-title class="headline">{{detail.title}}</v-card-title>
		<v-carousel
			hide-delimiters
			show-arrows-on-hover
			:show-arrows="detail.images.length > 1"
			v-if="detail.images.length > 0"
			height="250"
		>
			<v-carousel-item v-for="(n,idx) in detail.images" :key="idx" :contain="true">
				<v-img :src="n" :lazy-src="n" aspect-ratio="0.5" max-height="250" class="grey lighten-2">
					<template v-slot:placeholder>
						<v-row class="fill-height ma-0" align="center" justify="center">
							<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
						</v-row>
					</template>
				</v-img>
			</v-carousel-item>
		</v-carousel>
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