<template>
	<v-app>
		<v-row align="center">
			<v-row justify="space-around">
				<v-form ref="form" v-model="regValid">
					<v-text-field
						v-model="email"
						:rules="[rules.email,rules.required]"
						@click="resetEmailRule"
						label="E-mail"
					></v-text-field>
					<v-text-field
						:append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
						:type="showPass ? 'text' : 'password'"
						v-model="password"
						:counter="20"
						:rules="[rules.required,rules.counter]"
						label="Password"
						@click:append="showPass = !showPass"
						required
					></v-text-field>
					<v-btn
						:disabled="!regValid || loading"
						:loading="loading"
						color="success"
						class="mr-4"
						@click="validate"
					>Register</v-btn>
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
const userModule = namespace("User");

@Component({})
export default class Register extends Vue {
	$refs!: {
		form: HTMLFormElement;
	};
	@Action("User/fetchUser") private setUser!: any;
	regValid: boolean = true;
	loading: boolean = false;
	showPass: boolean = false;
	password: string = "";
	email: string = "";
	rules: IRule = {
		required: (value: string) => !!value || "Required",
		counter: (value: string) => value.length <= 20 || "Max 20 characters",
		email: (value: string) => {
			const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return pattern.test(value) || "Invalid e-mail";
		}
	};
	resetEmailRule() {
		if (typeof this.rules.email !== "function") {
			this.rules.email = (value: string) => {
				const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return pattern.test(value) || "Invalid e-mail";
			};
		}
	}
	validate() {
		if (this.$refs.form.validate()) {
			this.loading = true;
			FirebaseAPI.FBRegister({
				email: this.email,
				password: this.password
			})
				.then(data => {
					this.loading = false;
					if (data) {
						this.setUser(data);
						EventBus.$emit(
							"show-success",
							"Succesfully registered!"
						);
						this.$router.replace({ name: "Dashboard" });
					}
				})
				.catch(e => {
					if (e.code === "auth/email-already-in-use")
						this.rules.email = e.message;
					else SystemAlert(e.message);
				});
		}
	}
}
</script>

<style>
</style>