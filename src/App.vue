<template>
  <v-app id="inspire">
    <v-navigation-drawer app v-model="drawer" v-if="!this.isLandingPage">
      <v-list dense nav class="py-0">
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/81.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Application</v-list-item-title>
            <v-list-item-subtitle>Subtext</v-list-item-subtitle>
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
    <v-app-bar app color="primary" dark v-if="!this.isLandingPage">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <router-link to="/">
        <v-img :src="require('@/assets/logo.svg')" max-width="40"></v-img>
      </router-link>
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
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

@Component({})
export default class App extends Vue {
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
}
</script>
