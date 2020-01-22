<template>
	<v-card>
		<v-card-title class="headline">{{detail.title}}</v-card-title>
		<v-carousel
			hide-delimiters
			:show-arrows="detail.images.length > 1"
			v-if="detail.images.length > 0"
			height="400"
		>
			<v-carousel-item v-for="(n,idx) in detail.images" :key="idx">
				<zoom-image :n="n" :width="'350px'" :height="'400px'" />
			</v-carousel-item>
		</v-carousel>
	</v-card>
</template>

<script>
import EventBus from "../utils/event-bus";
import ZoomImage from "@/components/ZoomImage";
export default {
	props: ["detail"],
	components: {
		ZoomImage
	}
};
</script>

<style scoped>
.zoom-on-hover {
	position: relative;
	overflow: hidden;
}
.zoom-on-hover .normal {
	width: 100%;
}
.zoom-on-hover .zoom {
	position: absolute;
	opacity: 0;
	transform-origin: top left;
}
.zoom-on-hover.zoomed .zoom {
	opacity: 1;
}
.zoom-on-hover.zoomed .normal {
	opacity: 0;
}
</style>