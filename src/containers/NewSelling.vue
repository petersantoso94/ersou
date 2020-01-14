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
						<v-select :items="currencies" :rules="[rules.required]" label="Currency"></v-select>
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
				<v-row>
					<v-col></v-col>
					<v-col></v-col>
				</v-row>
				<v-row>
					<v-textarea
						outlined
						name="input-7-4"
						label="Description"
						placeholder="Reason to sell, condition, ..."
						v-model="description"
					></v-textarea>
				</v-row>
				<v-row justify="end">
					<v-btn tile outlined color="orange" @click="validate">
						<v-icon left>mdi-coin-outline</v-icon>Sell
					</v-btn>
				</v-row>
			</v-form>
		</v-container>
	</v-card>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import { IRule } from "@/models/interfaces/Common";
import { TransactionType } from "@/models/enum/common";
@Component({})
export default class NewSelling extends Vue {
	$refs!: {
		form: HTMLFormElement;
		autocom: HTMLInputElement;
	};
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
	description: string = "";
	title: string = "";
	place: string = "";
	price: number = 0;
	currencies: string[] = ["USD", "NTD", "IDR"];
	rules: IRule = {
		required: (value: string) => !!value || "Required"
	};
	sellValid: boolean = true;
	validate() {
		if (this.$refs.form.validate()) {
			alert("valid");
		}
	}
}
</script>

<style>
</style>