<template>
  <v-app>
    <v-toolbar dense class="white">
      <v-toolbar-items>
        <img :src="require('@/assets/ersou.gif')" alt="Vuetify.js" height="100%" class="mr-2" />
      </v-toolbar-items>
      <v-toolbar-title class="mx-0 blue--text blue--darken-2 font-weight-bold" v-text="title"></v-toolbar-title>
      <p style="color: lightgrey;font-size:60%">Beta</p>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-content>
            <v-list-item-title>
              {{
              item.title
              }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <section>
        <v-parallax :src="require('@/assets/images/hero_1.jpg')" height="600">
          <v-layout column align-center justify-center class="white--text">
            <h1
              class="white--text mb-2 display-1 text-xs-center"
              style="font-weight: 900; text-shadow: 3px 2px #000000"
            >Buy and sell platform for second hand items</h1>
            <div
              class="white--text subheading mb-3 text-xs-center"
              style="font-weight: 900; text-shadow: 2px 2px #000000"
            >Get your best deals, fast response</div>
            <v-btn class="blue lighten-2 mt-5" dark large href="/register">Get Started</v-btn>
          </v-layout>
        </v-parallax>
      </section>
      <section>
        <v-layout column wrap class="my-5" align-center>
          <v-flex xs12 sm4 class="my-3">
            <div class="text-xs-center">
              <h2 class="headline">The best way to share your stuff</h2>
              <span class="subheading">No more restrictions, no more limits</span>
            </div>
          </v-flex>
          <v-flex xs12>
            <v-container grid-list-xl>
              <v-layout row wrap align-center>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">public</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Reach the world</div>
                    </v-card-title>
                    <v-card-text>Show your stuff to the whole community of Endorfine not only to your mum or your friends. We love making good content viral. In this moment Endorfine is used by artists who are not famous but that want to share their works to the world. Unfortunately with other social networks this is hard, slow and sometime expensive.</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">flash_on</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline">Fast feedback</div>
                    </v-card-title>
                    <v-card-text>Time is important, we don't want you to waste it. Here you can get a massive feedback from real users in minutes. And if your stuff is appreciated you won't only get positive feedback but also lovely and sincere fans</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large class="blue--text text--lighten-2">share</v-icon>
                    </v-card-text>
                    <v-card-title primary-title class="layout justify-center">
                      <div class="headline text-xs-center">Create new connections</div>
                    </v-card-title>
                    <v-card-text>Imagine if you can directly speak with the world's population. Don't you think it would be easier to find nice people to interact with? Ersou is both local and global and help you to connect without limitations with people from your city, your state and your universe!</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </section>
      <v-footer class="blue darken-2">
        <v-row>
          <v-flex xs12 class="text-center">
            <div class="white--text ml-3">
              Made with
              <v-icon class="red--text">favorite</v-icon>using
              <a class="white--text" href="https://vuetifyjs.com" target="_blank">Vuetify</a>
            </div>
          </v-flex>
        </v-row>
      </v-footer>
    </v-content>
  </v-app>
</template>


<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import FBApi from "@/api/firebase";

@Component({})
export default class Landing extends Vue {
  title: string = "ersou";
  items: { [key: string]: string }[] = [
    { title: "Buy / Sell", to: "/dashboard" },
    { title: "Login", to: "/login" },
    { title: "Register", to: "/register" }
    // { title: "About", to: "/about" }
  ];
}
</script>

<style></style>
