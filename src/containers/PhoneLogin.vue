<template>
    <div>
        <div align="center" id="recaptcha-container">
        </div>
        <v-container>
            <v-form ref="form" v-if="captchaSuccess" v-model="phoneLoginValid">
                <v-row>
                    <v-col cols="12" md="8">
                        <v-text-field
                                :rules="[rules.required]"
                                label="Phone Number"
                                v-model="phone"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-btn
                                :disabled="!phoneLoginValid || loading"
                                :loading="loading"
                                @click="validate"
                                class="mr-4"
                                color="success"
                                width="100%"
                        >Get Code
                        </v-btn>
                    </v-col>
                    <div v-if="phoneNumberValid" align="center">
                        <v-subheader>Verification Code:</v-subheader>
                        <DigitTextbox :qty="qty" @on-blur-event-handler="codeOnBlurHandler"></DigitTextbox>
                    </div>

                </v-row>
            </v-form>
            <v-btn
                    :disabled="!verificationCodeValid || loading"
                    :loading="loading"
                    @click="doLogin"
                    class="mr-4"
                    color="success"
                    v-if="verificationCodeValid"
                    width="100%"
            >Login
            </v-btn>
        </v-container>

        <v-overlay :value="loading">
            <v-progress-circular indeterminate size="70"></v-progress-circular>
        </v-overlay>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import * as firebase from "firebase/app";
    import 'firebase/auth'
    import {IRule} from "@/models/interfaces/Common";
    import FirebaseAPI from "@/api/firebase";
    import DigitTextbox from "@/components/DigitTextbox.vue";
    import EventBus from "@/utils/event-bus";
    import {Action} from "vuex-class";

    @Component({
        components: {DigitTextbox}
    })
    export default class PhoneLogin extends Vue {
        $refs!: {
            form: HTMLFormElement;
        };
        @Action("User/fetchUser") private setUser!: any;
        phoneLoginValid: boolean = true;
        phoneNumberValid: boolean = false;
        verificationCodeValid: boolean = false;
        recaptchaVerifier !: firebase.auth.RecaptchaVerifier;
        confirmationResult !: firebase.auth.ConfirmationResult;
        recaptchaWidgetId !: number;
        appVerifier!: firebase.auth.ApplicationVerifier;
        captchaSuccess: boolean = false;
        loading: boolean = false;
        phone: string = "";
        qty: number = 6;
        verificationCode:string="";
        rules: IRule = {
            required: (value: string) => !!value || "Required",
        }

        renderReCaptcha() {
            this.recaptchaVerifier.render().then((widgetId) => {
                this.recaptchaWidgetId = widgetId;
                this.loading = false;
            });
        }

        doLogin() {
            this.loading = true;
            this.confirmationResult.confirm(this.verificationCode).then((result:firebase.auth.UserCredential)=>{
                let data = result.user;
                this.setUser(data);
                this.$router.replace({ name: "Dashboard" });
            }).catch((e:Error)=>{
                EventBus.$emit("show-error",e);
            }).finally(()=>{
                this.loading = false;
            })
        }

        codeOnBlurHandler(code: string) {
            if (code.length === this.qty) {
                this.verificationCodeValid = true;
                this.verificationCode = code;
            } else {
                this.verificationCodeValid = false;
            }
        }

        validate() {
            if (this.$refs.form.validate()) {
                this.loading = true;
                FirebaseAPI.FBPhoneLogin(this.phone, this.recaptchaVerifier).then((resp: firebase.auth.ConfirmationResult) => {
                    this.confirmationResult = resp;
                    this.phoneNumberValid = true;
                }).catch((e:Error)=>{
                    this.captchaSuccess = false;
                    this.$refs.form.reset();
                    this.recaptchaVerifier.render();
                    EventBus.$emit("show-error",e);
                }).finally(()=>{
                    this.loading = false;
                });
            }
        }

        mounted() {
            this.loading = true;
            this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'normal',
                'callback': (response: firebase.auth.ApplicationVerifier) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    // ...
                    this.appVerifier = response;
                    this.captchaSuccess = true;
                },
                'expired-callback': function () {
                    // Response expired. Ask user to solve reCAPTCHA again.
                    // ...
                }
            });
            this.renderReCaptcha()
        }
    }
</script>

<style scoped>
    #recaptcha-container {
        padding-top: 10px;
        padding-bottom: 10px;
        width: 100%;
    }
</style>