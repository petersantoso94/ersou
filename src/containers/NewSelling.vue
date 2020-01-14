<template>
	<v-card flat tile>
		<v-container>
			<v-form ref="form" v-model="sellValid">
				<v-row>
					<v-col>
						<v-text-field v-model="title" :rules="[rules.required]" label="What will you sell?"></v-text-field>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="2">
						<v-select :items="currencies" v-model="curr" :rules="[rules.required]" label="Currency"></v-select>
					</v-col>
					<v-col cols="5">
						<v-text-field v-model="price" :rules="[rules.required]" label="Price" type="number"></v-text-field>
					</v-col>
					<v-col cols="5">
						<v-text-field
							type="search"
							v-model="place"
							:rules="[rules.required]"
							label="Pickup Place"
							id="auto-complete"
						></v-text-field>
					</v-col>
				</v-row>
				<v-row class="mb-4">
					<v-slider
						v-model="condition"
						:tick-labels="qualityLabels"
						:max="qualityLabels.length-1"
						:rules="[rules.required]"
						step="1"
						ticks="always"
						:tick-size="qualityLabels.length"
					>
						<template v-slot:thumb-label="props">{{ qualityIcon[props.value] }}</template>
					</v-slider>
				</v-row>
				<v-row>
					<v-textarea
						outlined
						name="input-7-4"
						label="Description"
						placeholder="Reason to sell, detailed condition, ..."
						v-model="description"
					></v-textarea>
				</v-row>
				<v-row justify="end">
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
import { arrConditions } from "@/utils/helper";
import FB from "@/api/firebase";
import { Items, ItemsOptions } from "../models/interfaces/Items";
import * as firebase from "firebase/app";
import "firebase/firestore";
import EventBus, { SystemAlert } from "../utils/event-bus";
@Component({})
export default class NewSelling extends Vue {
	$refs!: {
		form: HTMLFormElement;
		autocom: HTMLInputElement;
	};
	description: string = "";
	title: string = "";
	place: string = "";
	price: number = 0;
	loading: boolean = false;
	condition: number = 0;
	curr: string = "NTD";
	currencies: string[] = ["USD", "NTD", "IDR"];
	qualityLabels: string[] = arrConditions;
	qualityIcon: string[] = ["0%", "20%", "40%", "60%", "80%", "100%"];
	rules: IRule = {
		required: (value: string) => !!value || "Required"
	};
	sellValid: boolean = true;
	mounted() {
		const places = require("places.js");
		const that = this;
		const placesAutocomplete = places({
			appId: "plN8CZBA98O2",
			apiKey: "251731162a7ccdb036d8851c75a3dec9",
			container: document.querySelector("#auto-complete")
		}).configure({
			countries: ["tw"]
		});
		placesAutocomplete.on("change", function(e: any) {
			that.place = e.suggestion.value;
		});

		placesAutocomplete.on("clear", function() {
			that.place = "";
		});
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
				sell: true
			};
			FB.FBSetItemsDoc(ItemsOption).then(() => {
				this.loading = false;
				EventBus.$emit(
					"show-success",
					"Succesfully added Selling Item"
				);
				EventBus.$emit("go-to-buy");
			});
		}
	}
}
</script>

<style>
</style>