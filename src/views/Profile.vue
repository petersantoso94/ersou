<template>
	<v-app>
		<v-row align="center">
			<v-row justify="space-around">
				<v-form ref="form" v-model="changeInfoValid">
					<v-text-field v-model="displayName" :rules="[rules.required]" label="Display Name"></v-text-field>
					<v-btn
						:disabled="!changeInfoValid || loading"
						:loading="loading"
						color="success"
						class="mr-4"
						@click="validate"
					>Update</v-btn>
				</v-form>
			</v-row>
		</v-row>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { IRule } from "@/models/interfaces/Common";
import { IUser } from "@/models/interfaces/User";
import FirebaseAPI from "@/api/firebase";
import EventBus, { SystemAlert } from "../utils/event-bus";
import { State, Action, Getter, namespace } from "vuex-class";
import store from "../store";
const userModule = namespace("User");

@Component({})
export default class Login extends Vue {
	$refs!: {
		form: HTMLFormElement;
	};
	@Action("User/fetchUser") private setUser!: any;
	loading: boolean = false;
	changeInfoValid: boolean = true;
	displayName: string = store.getters["User/User"].data.displayName;
	rules: IRule = {
		required: (value: string) => !!value || "Required"
	};
	validate() {
		if (this.$refs.form.validate()) {
			this.loading = true;
			FirebaseAPI.FBUpdateUserInfo(this.displayName)
				.then(() => {
					EventBus.$emit(
						"show-success",
						"Succesfully change profile info!"
					);
					this.loading = false;
				})
				.catch(e => {
					SystemAlert(e.message);
				});
		}
	}
}
</script>

<style>
</style>