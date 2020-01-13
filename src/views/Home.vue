<template>
	<div class="home">
		<v-app>
			<v-container>
				<v-row>
					<v-col cols="12">
						<v-tabs fixed-tabs background-color="indigo" dark>
							<v-tab v-for="i in tabs" :key="i" :href="`#tab-${i}`" @click="chosenTab = i">{{ i }}</v-tab>

							<v-tab-item v-for="i in tabs" :key="i" :value="'tab-' + i">
								<NewBuySale :type="i" />
							</v-tab-item>
						</v-tabs>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<v-card>
							<v-card-title>
								Secondhand Items:
								<v-spacer />
								<v-text-field v-model="search" append-icon="search" single-line hide-details></v-text-field>
							</v-card-title>

							<v-data-table
								:headers="headers"
								:items="selectedItems"
								:items-per-page="5"
								:search="search"
								class="elevation-1"
							></v-data-table>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</v-app>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import FBApi from "@/api/firebase";
import { SystemAlert } from "../utils/event-bus";
import { IUser } from "../models/interfaces/User";
import { datetimeMixin } from "@/utils/helper";
import { Items } from "@/models/interfaces/Items";
import { TransactionType } from "@/models/enum/common";
import NewBuySale from "@/components/NewBuySell.vue";

@Component({
	components: {
		NewBuySale
	}
})
export default class Landing extends Vue {
	items: Items[] = [];
	search: string = "";
	chosenTab: TransactionType = TransactionType.Sell;
	headers: { [key: string]: string }[] = [
		{ text: "Title", value: "title" },
		{ text: "Description", value: "desc" },
		{ text: "Price", value: "price" },
		{ text: "Posted at", value: "created" }
	];
	tabs: string[] = [TransactionType.Sell, TransactionType.Buy];
	mounted() {
		FBApi.FBItemsCollection().onSnapshot(data => {
			if (!data) SystemAlert("Items collection empty");
			const temp: Items[] = [];
			data.forEach(el => {
				temp.push({
					title: el.data().title,
					desc: el.data().description,
					price: el.data().price,
					created: datetimeMixin.filters.timestampToDateAndTime(
						el.data().created.seconds
					),
					sell: el.data().sell
				});
			});
			this.items = temp;
		});
	}

	get selectedItems(): Items[] {
		return this.items.filter(
			el => el.sell !== (this.chosenTab === TransactionType.Sell)
		);
	}
}
</script>
