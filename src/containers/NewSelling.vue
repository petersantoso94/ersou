<template>
  <v-card raised tile class="px-1">
    <v-container>
      <v-form ref="form" v-model="sellValid">
        <v-row>
          <v-col>
            <v-text-field v-model="title" :rules="[rules.required]" label="What will you sell?"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" lg="2">
            <v-select :items="currencies" v-model="curr" :rules="[rules.required]" label="Currency"></v-select>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <v-text-field v-model="price" :rules="[rules.required]" label="Price" type="number"></v-text-field>
          </v-col>
          <v-col cols="12" lg="6">
            <v-text-field
              type="search"
              v-model="place"
              :rules="[rules.required]"
              label="Pickup Place"
              id="auto-complete"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="6" lg="6">
            <v-row>
              <v-col cols="6">
                <v-select
                  :items="qualityLabels"
                  v-model="condition"
                  :rules="[rules.required]"
                  label="Condition"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-file-input
                  show-size
                  v-model="images"
                  :rules="imgRules"
                  ref="imagesRef"
                  :multiple="true"
                  @change="onImagesChange"
                  accept="image/png, image/jpeg, image/bmp"
                  prepend-icon="mdi-camera"
                  label="Picture"
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-textarea
                outlined
                name="input-7-4"
                label="Description"
                rows="5"
                placeholder="Reason to sell, detailed condition, ..."
                v-model="description"
              ></v-textarea>
            </v-row>
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="6">
            <v-carousel
              hide-delimiters
              show-arrows-on-hover
              :show-arrows="imagesUrls.length > 1"
              v-if="imagesUrls.length > 0"
              height="250"
            >
              <v-carousel-item v-for="(n,idx) in imagesUrls" :key="idx" :contain="true">
                <v-img
                  :src="n"
                  :lazy-src="n"
                  aspect-ratio="0.5"
                  max-height="250"
                  class="grey lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-carousel-item>
            </v-carousel>
            <!-- <v-row v-if="imagesUrls.length > 0">
							<v-col v-for="n in imagesUrls" :key="n" class="d-flex child-flex" cols="4">
								<v-card flat tile class="d-flex">
									<v-img :src="n" :lazy-src="n" aspect-ratio="1" :contain="true" class="grey lighten-2">
										<template v-slot:placeholder>
											<v-row class="fill-height ma-0" align="center" justify="center">
												<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
											</v-row>
										</template>
									</v-img>
								</v-card>
							</v-col>
            </v-row>-->
          </v-col>
        </v-row>

        <v-row justify="end" class="mr-1">
          <v-btn
            tile
            outlined
            color="orange"
            :disabled="!sellValid || loading"
            :loading="loading"
            @click="validate"
          >
            <v-icon left>mdi-coin-outline</v-icon>Sell
          </v-btn>
        </v-row>
      </v-form>
    </v-container>
    <v-overlay :value="loading" style="z-index: 9999">
      <v-progress-circular indeterminate size="70"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import { IRule } from "@/models/interfaces/Common";
import { TransactionType, QualityMeasurement } from "@/models/enum/common";
import { arrConditions, resizeImage, brokenImg } from "@/utils/helper";
import FB from "@/api/firebase";
import { Items, ItemsOptions } from "../models/interfaces/Items";
import * as firebase from "firebase/app";
import "firebase/firestore";
import EventBus, { SystemAlert } from "../utils/event-bus";
import store from "../store";
import { initPlaceJS } from "../utils/placejs-helper";
@Component({})
export default class NewSelling extends Vue {
  $refs!: {
    form: HTMLFormElement;
    autocom: HTMLInputElement;
    imagesRef: any;
  };
  description: string = "";
  title: string = "";
  place: string = "";
  currentUser: string = store.getters["User/User"].data.email;
  price: number = 0;
  loading: boolean = false;
  condition: number = 0;
  maxSize: number = 5000000;
  errorMaxSize = "5 MB";
  images: File[] = [];
  imagesUrls: string[] = [brokenImg];
  sellValid: boolean = true;
  curr: string = "NTD";
  currencies: string[] = ["USD", "NTD", "IDR"];
  qualityLabels: { [key: string]: string | number }[] = [
    { value: 0, text: QualityMeasurement.Broken },
    { value: 1, text: QualityMeasurement.Poor },
    { value: 2, text: QualityMeasurement.DailyUsed },
    { value: 3, text: QualityMeasurement.RarelyUsed },
    { value: 4, text: QualityMeasurement.AlmostLikeNew },
    { value: 5, text: QualityMeasurement.New }
  ];
  rules: IRule = {
    required: (value: string | number) => value === 0 || !!value || "Required"
  };
  imgRules = [
    (values: File[]): boolean | string => {
      if (values.length === 0) {
        return true;
      }
      let size = 0;
      values.some(value => {
        size += value.size;
      });
      if (size >= this.maxSize) {
        return `Photos size exceeds ${this.errorMaxSize}, please choose smaller one`;
      }

      return true;
    }
  ];
  mounted() {
    const onChangeHandler = (e: any) => {
      this.place = e.suggestion.value;
    };
    const onClearHandler = () => {
      this.place = "";
    };
    initPlaceJS("#auto-complete", onChangeHandler, onClearHandler);
  }
  onImagesChange(files: File[]) {
    if (!this.$refs.imagesRef.validate()) {
      this.imagesUrls = [brokenImg];
      return;
    }
    if (files.length > 0) {
      this.imagesUrls.pop();
      files.some(file => {
        resizeImage(file).then(dataurl => {
          this.imagesUrls.push(dataurl);
        });
      });
    } else {
      this.imagesUrls = [brokenImg];
    }
  }
  resetValue() {
    this.title = "";
    this.place = "";
    this.price = 0;
    this.description = "";
    this.curr = "NTD";
    this.condition = 0;
    this.images = [];
    this.imagesUrls = [brokenImg];
    this.sellValid = true;
    this.$refs.form.reset();
    this.$refs.form.resetValidation();
  }
  validate() {
    this.loading = true;
    if (this.$refs.form.validate()) {
      const ItemsOption: ItemsOptions = {
        title: this.title,
        address: this.place,
        price: this.price,
        description: this.description,
        currency: this.curr,
        condition: this.condition,
        created: firebase.firestore.Timestamp.fromDate(new Date()),
        images: "",
        sell: true,
        owner: this.currentUser,
        messages: this.currentUser + ":0"
      };
      let imagesUrlString = "";
      let imgUrlArr: string[] = [];
      this.images.some(image => {
        FB.FBUploadImageToStorage(image).then(snapshot => {
          snapshot.ref.getDownloadURL().then(url => {
            imgUrlArr.push(url);
            if (imgUrlArr.length === this.images.length) {
              ItemsOption.images = imgUrlArr.join(",");
              FB.FBSetItemsDoc(ItemsOption).then(() => {
                this.loading = false;
                EventBus.$emit(
                  "show-success",
                  "Succesfully added Selling Item"
                );
                EventBus.$emit("go-to-buy");
                this.resetValue();
              });
            }
          });
        });
      });
    }
  }
}
</script>

<style>
</style>