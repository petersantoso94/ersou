<template>
  <div class="home">
    this is homepage, data:
    <v-data-table :headers="headers" :items="items" :items-per-page="5" class="elevation-1"></v-data-table>
    <button @click="signOut">logout</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import FBApi from "@/api/firebase";
import { SystemAlert } from "../utils/event-bus";

@Component({})
export default class Landing extends Vue {
  items: { [key: string]: string }[] = [];
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
          created: el.data().created
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
