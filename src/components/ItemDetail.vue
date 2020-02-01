<template>
  <v-card>
    <v-card-title class="headline">
      {{detail.title}}
      <v-spacer></v-spacer>
      <v-btn icon @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-container>
      <v-row>
        <v-col cols="12" md="8">
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
        </v-col>
        <v-col cols="12" md="4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Pick up address"
                prepend-icon="place"
                readonly
                :value="detail.address"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import EventBus from "../utils/event-bus";
import ZoomImage from "@/components/ZoomImage";
export default {
  props: ["detail", "closeDialog"],
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