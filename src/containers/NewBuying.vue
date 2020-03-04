<template>
  <v-card tile>
    <v-container>
      <v-form ref="form" v-model="buyValid">
        <v-row dense>
          <v-col cols="12" md="6">
            <v-row dense>
              <v-col cols="12">
                <v-text-field v-model="title" :rules="[rules.required]" label="What will you buy?"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="search"
                  v-model="place"
                  :rules="[rules.required]"
                  label="Pickup place preference"
                  id="auto-complete-buy"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="qualityLabels"
                  v-model="condition"
                  :rules="[rules.required]"
                  label="Expected Condition"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-row dense>
              <v-col cols="4">
                <v-select
                  :items="currencies"
                  v-model="curr"
                  :rules="[rules.required]"
                  label="Currency"
                ></v-select>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="price"
                  :rules="[rules.required]"
                  label="Max Budget"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  outlined
                  name="input-7-4"
                  rows="5"
                  placeholder="Detail about what you want to buy / looking for.."
                  label="Description"
                  v-model="description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-btn
            tile
            outlined
            color="success"
            :disabled="!buyValid || loading"
            :loading="loading"
            @click="validate"
          >
            <v-icon left>mdi-cash-usd-outline</v-icon>Buy
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
import { TransactionType, QualityMeasurement } from "@/models/enum/common";
import { IRule } from "../models/interfaces/Common";
import { ItemsOptions } from "../models/interfaces/Items";
import * as firebase from "firebase/app";
import "firebase/firestore";
import FB from "@/api/firebase";
import EventBus from "../utils/event-bus";
import store from "../store";
import { initPlaceJS } from "@/utils/placejs-helper";
@Component({})
export default class NewBuying extends Vue {
  $refs!: {
    form: HTMLFormElement;
    autocom: HTMLInputElement;
  };
  description: string = "";
  title: string = "";
  place: string = "";
  currentUser: string = store.getters["User/User"].data.email;
  curr: string = "NTD";
  currencies: string[] = ["USD", "NTD", "IDR"];
  condition: number = 5;
  price: number = 0;
  loading: boolean = false;
  buyValid: boolean = true;
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
  mounted() {
    const onChangeHandler = (e: any) => {
      this.place = e.suggestion.value;
    };
    const onClearHandler = () => {
      this.place = "";
    };
    initPlaceJS("#auto-complete-buy", onChangeHandler, onClearHandler);
  }
  resetValue() {
    this.title = "";
    this.place = "";
    this.price = 0;
    this.description = "";
    this.curr = "NTD";
    this.condition = 0;
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
        sell: false,
        owner: this.currentUser,
        messages: this.currentUser + ":0"
      };
      FB.FBSetItemsDoc(ItemsOption).then(() => {
        this.loading = false;
        EventBus.$emit("show-success", "Succesfully added Selling Item");
        EventBus.$emit("go-to-sell");
        this.resetValue();
      });
    }
  }
}
</script>

<style>
</style>