<template>
	<v-card tile>
		<v-container>
			<v-row>
				<v-textarea outlined name="input-7-4" label="Description" v-model="description"></v-textarea>
			</v-row>
			<v-row justify="end">
				<v-btn tile outlined color="success">
					<v-icon left>mdi-cash-usd-outline</v-icon>Buy
				</v-btn>
			</v-row>
		</v-container>
	</v-card>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import { TransactionType } from "@/models/enum/common";
@Component({})
export default class NewBuying extends Vue {
	description: string = "";
}
</script>

<style>
</style>