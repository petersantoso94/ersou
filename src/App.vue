<template>
	<v-app id="inspire">
		<v-navigation-drawer app v-model="drawer" :right="true" v-if="!this.isLandingPage && user.data">
			<v-list dense nav class="py-0">
				<v-list-item two-line>
					<v-list-item-avatar>
						<img src="https://randomuser.me/api/portraits/men/81.jpg" />
					</v-list-item-avatar>

					<v-list-item-content v-if="user.data">
						<v-list-item-title>{{user.data.email}}</v-list-item-title>
						<v-list-item-subtitle>
							<v-btn x-small @click="signOut" outlined color="red">logout</v-btn>
						</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>

				<v-divider></v-divider>

				<v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
					<v-list-item-icon>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>
							{{
							item.title
							}}
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar app color="indigo" dark v-if="!this.isLandingPage">
			<!-- TODO: uncomment if the drawer is ready -->
			<!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
			<router-link to="/">
				<v-img :src="require('@/assets/logo.svg')" max-width="40"></v-img>
			</router-link>
			<v-toolbar-title>{{ $route.name }}</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon big @click.stop="drawer = !drawer" v-if="user.data">
				<v-icon>mdi-account-circle</v-icon>
			</v-btn>
		</v-app-bar>
		<v-content>
			<router-view />
			<v-snackbar v-model="snackbar" :timeout="2000">
				{{ text }}
				<v-btn color="blue" text @click="snackbar = false">Close</v-btn>
			</v-snackbar>
		</v-content>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import EventBus from "@/utils/event-bus";
import FBApi from "@/api/firebase";
import { State, Action, Getter, namespace } from "vuex-class";
const userModule = namespace("User");

@Component({})
export default class App extends Vue {
	@userModule.State("User") user!: firebase.User;
	drawer: boolean = false;
	snackbar: boolean = false;
	text: string = "";
	isLandingPage: boolean = true;
	items: { [key: string]: string }[] = [
		{ title: "Dashboard", icon: "mdi-view-dashboard", to: "/home" },
		{ title: "About", icon: "mdi-help-box", to: "/about" }
	];

	mounted() {
		EventBus.$on("system-alert", (msg: string) => {
			this.text = msg;
			this.snackbar = true;
		});
	}

	@Watch("$route")
	checkLandingPage() {
		this.isLandingPage = this.$route.name === "Landing";
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
