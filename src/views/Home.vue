<template>
	<div class="home">
		<v-app>
			<v-container>
				<v-row>
					<v-col cols="12">
						<v-row justify="space-between">
							<v-toolbar-title>Hi, {{user.data.email}}:</v-toolbar-title>
							<v-btn @click="signOut" outlined color="red">logout</v-btn>
						</v-row>
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
								:items="items"
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
import { Component } from "vue-property-decorator";
import FBApi from "@/api/firebase";
import { SystemAlert } from "../utils/event-bus";
import { State, Action, Getter, namespace } from "vuex-class";
import { IUser } from "../models/interfaces/User";
import { datetimeMixin } from "@/utils/helper";
const userModule = namespace("User");

@Component({})
export default class Landing extends Vue {
	@userModule.State("User") user!: firebase.User;
	items: { [key: string]: string }[] = [];
	search: string = "";
	headers: { [key: string]: string }[] = [
		{ text: "Title", value: "title" },
		{ text: "Description", value: "desc" },
		{ text: "Price", value: "price" },
		{ text: "Posted at", value: "created" }
	];
	mounted() {
		FBApi.FBItemsCollection().onSnapshot(data => {
			if (!data) SystemAlert("Items collection empty");
			const temp: { [key: string]: string }[] = [];
			data.forEach(el => {
				temp.push({
					title: el.data().title,
					desc: el.data().description,
					price: el.data().price,
					created: datetimeMixin.filters.timestampToDateAndTime(
						el.data().created.seconds
					)
				});
			});
			this.items = temp;
		});
	}
	signOut() {
		FBApi.FBLogout().then(() => {
			this.$router.replace({
				name: "Landing"
			});
		});
	}
}
</script>
