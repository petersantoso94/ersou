<template>
    <v-app>
        <v-row align="center">
            <v-row justify="space-around">
                <v-col cols="4"  class="min-width-450">
                    <v-tabs fixed-tabs v-model="tabHref">
                        <v-tab :href="`#tab-${i.component}`" :key="i.component" @click="chosenTab = i.component"
                               v-for="i in tabs">{{ i.displayName }}
                        </v-tab>
                        <v-tab-item :key="i.component" :value="'tab-' + i.component" v-for="i in tabs">
                            <v-card tile>
                                <v-container>
                                    <keep-alive>
                                        <component :is="i.component"/>
                                    </keep-alive>
                                </v-container>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                </v-col>
            </v-row>
        </v-row>
    </v-app>
</template>

<script lang="ts">
    import {Component} from "vue-property-decorator";
    import Vue from "vue";
    import EmailLogin from "@/containers/EmailLogin.vue";
    import {LoginType} from "@/models/enum/common";
    import PhoneLogin from "@/containers/PhoneLogin.vue";
    import EventBus from "@/utils/event-bus";

    @Component({
        components: {
            EmailLogin,
            PhoneLogin
        },
    })
    export default class Login extends Vue {
        tabs: any[] = [{
            component: LoginType.Email + "Login",
            displayName: LoginType.Email
        }, {component: LoginType.Phone + "Login", displayName: LoginType.Phone},];
        tabHref: string = "tab-" + LoginType.Email + "Login";
        loading: boolean = false;

        mounted() {
            EventBus.$on("show-loading", () => {
                this.loading = true;
            })
            EventBus.$on("hide-loading", () => {
                this.loading = false;
            })
        }
    }
</script>

<style scoped>
    .min-width-450{
        min-width: 450px;
    }
</style>