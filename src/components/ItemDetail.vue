<template>
  <v-card>
    <v-card-title class="headline">
      {{detail.title}}
      <v-chip class="ml-2" color="blue darken-1" text-color="white" small>{{detail.condition}}</v-chip>
      <v-spacer></v-spacer>
      <v-btn icon @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-subtitle>{{detail.created | moment("from", "now")}}</v-card-subtitle>
    <v-container style="margin-top:-20px;">
      <v-row dense>
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
          <v-row dense>
            <v-col cols="12">
              <v-row dense>
                <v-col cols="3">
                  <v-text-field label="Price" readonly :value="detail.currency"></v-text-field>
                </v-col>
                <v-col cols="9">
                  <v-text-field readonly :value="detail.price"></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Pick up address"
                prepend-icon="place"
                readonly
                :value="detail.address"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                outlined
                rows="5"
                no-resize
                label="Description"
                readonly
                :value="detail.description"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Owner" prepend-icon="person" readonly :value="detail.owner"></v-text-field>
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
html {
  overflow-y: auto;
}
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