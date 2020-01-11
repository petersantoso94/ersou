<template>
  <div>
    Landing page, go to
    <router-link to="/home">Homepage</router-link>or
    <router-link to="/register">Register</router-link>or
    <router-link to="/login">Login</router-link>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import FBApi from "@/api/firebase";

@Component({})
export default class Landing extends Vue {}
</script>

<style></style>
