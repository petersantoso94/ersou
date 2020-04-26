<template>
    <v-container class="d-flex justify-start flex-wrap">
        <v-card :max-width="maxWidth" class="ma-1 pl-1" v-bind:key="`text-${idx}`" v-for="(data,idx) in textFieldData">
            <input
                    :ref="`input-${idx}`"
                    @input="onInputHandler($event,idx)"
                    @keyup="onKeyUpHandler($event,idx)"
                    required
                    type="number"
                    v-model="data.model"
            />
        </v-card>
    </v-container>
</template>

<script lang="ts">
    import {Component, Prop} from "vue-property-decorator";
    import Vue from "vue";
    import {ITextFieldData} from "@/models/interfaces/Common";

    @Component({})
    export default class DigitTextBox extends Vue {
        textFieldData: ITextFieldData[] = [];
        maxWidth: string = "100%"
        @Prop(Number) readonly qty!: number;


        onInputHandler(e: any, idx: number) {
            let val = (this.$refs[`input-${idx}`] as any)[0].value;
            if (val.length > 1) {
                this.textFieldData[idx].model = val.slice(0, 1)
            }
            if (e.inputType === 'insertText' && idx + 1 < this.qty) {
                (this.$refs[`input-${idx + 1}`] as any)[0].focus();
            }
            if (idx === this.qty - 1 && val.length === 1) {
                let textData = this.textFieldData.reduce(
                    (prev, curr) => prev + curr.model,
                    ""
                );
                textData && this.$emit("on-blur-event-handler", textData);
            }
        }

        onKeyUpHandler(e: KeyboardEvent, idx: number) {
            if (e.code === 'Backspace' && idx - 1 >= 0) {
                (this.$refs[`input-${idx - 1}`] as any)[0].focus();
            }
        }

        mounted() {
            for (let i = 0; i < this.qty; i++) {
                this.textFieldData.push({model: ""});
            }
            this.maxWidth = `${100 / (this.qty) - 2}%`;
        }
    }
</script>

<style scoped>
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0 !important;
        outline: 1px black;
    }

    /* Firefox */
    input[type="number"] {
        -moz-appearance: textfield !important;
        outline: 1px black;
        margin: 2px;
    }

    .container {
        margin-top: -5px !important;
    }
</style>