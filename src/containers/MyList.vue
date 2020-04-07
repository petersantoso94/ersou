<template>
    <v-card tile>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-data-table
                            :items="selectedItems"
                            :items-per-page.sync="itemsPerPage"
                            :page="page"
                            :loading="loading"
                            :search="search"
                            :headers="itemHeaders"
                            v-model="selectedItem"
                            hide-default-footer
                    >
                        <template v-slot:item.sell="{ item }">
                            <v-chip :color="getColor(item)" dark>{{ getStatusString(item) }}</v-chip>
                        </template>
                        <template slot="no-data">
                            <div></div>
                        </template>
                        <template v-slot:loading>
                            <v-row class="mx-2" v-for="n in 4" :key="n">
                                <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
                            </v-row>
                        </template>
                        <template v-slot:top>
                            <v-toolbar dark color="blue darken-3" class="mb-1">
                                <v-text-field
                                        v-model="search"
                                        clearable
                                        flat
                                        solo-inverted
                                        hide-details
                                        prepend-inner-icon="search"
                                        label="Search"
                                ></v-text-field>
                            </v-toolbar>
                        </template>
                        <template v-slot:footer>
                            <v-row class="mt-2" align="center" justify="center">
                                <v-col cols="4" class="ml-2">
                                    <span class="grey--text">Items per page</span>
                                    <v-menu offset-y>
                                        <template v-slot:activator="{ on }">
                                            <v-btn dark text color="primary" class="ml-2" v-on="on">
                                                {{ itemsPerPage }}
                                                <v-icon>mdi-chevron-down</v-icon>
                                            </v-btn>
                                        </template>
                                        <v-list>
                                            <v-list-item
                                                    v-for="(number, index) in itemsPerPageArray"
                                                    :key="index"
                                                    @click="updateItemsPerPage(number)"
                                            >
                                                <v-list-item-title>{{ number }}</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="4" class="text-right mr-2">
                                    <span class="mr-4 grey--text">Page {{ page }} of {{ numberOfPages }}</span>
                                    <v-btn fab dark small color="blue darken-3" class="mr-1"
                                           @click="formerPage">
                                        <v-icon>mdi-chevron-left</v-icon>
                                    </v-btn>
                                    <v-btn fab dark small color="blue darken-3" class="ml-1" @click="nextPage">
                                        <v-icon>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Watch, Prop} from "vue-property-decorator";
    import {Items} from "@/models/interfaces/Items";
    import {QualityMeasurement, TransactionType} from "@/models/enum/common";
    import FBApi from "@/api/firebase";
    import {SystemAlert} from "@/utils/event-bus";
    import {arrConditions, brokenImg, datetimeMixin} from "@/utils/helper";
    import store from "@/store";

    @Component({})
    export default class MyList extends Vue {
        items: Items[] = [];
        selectedItem: Items[] = [];
        isSelling: boolean = true;
        itemsPerPageArray: number[] = [10, 20, 50];
        itemsPerPage: number = 10;
        page: number = 1;
        loading: boolean = false;
        search: string = "";
        currentUser: string = store.getters["User/User"].data.email;
        itemHeaders= [
            {
                text: 'Your Item',
                align: 'start',
                value: 'title',
            },{
                text: 'Description',
                align: 'start',
                value: 'description',
            },
            { text: 'Currency', value: 'currency' },
            { text: 'Price', value: 'price' },
            { text: 'Address', value: 'address' },
            { text: 'Condition', value: 'condition' },
            { text: 'Status', value: 'sell' },
        ];

        mounted() {
            FBApi.FBItemsCollection().onSnapshot(data => {
                if (!data) SystemAlert("Items collection empty");
                const temp: Items[] = [];
                data.forEach(el => {
                    const conditionStr =
                        arrConditions[el.data().condition] ||
                        QualityMeasurement.New;
                    const imgArr: string[] = el.data().images
                        ? el.data().images.split(",")
                        : [brokenImg];

                    if(el.data().owner === this.currentUser) {
                        temp.push({
                            id: el.id,
                            title: el.data().title,
                            messages: el.data().messages,
                            description: el.data().description,
                            price: el.data().price,
                            created: datetimeMixin.filters.timestampToDateAndTime(
                                el.data().created.seconds
                            ),
                            sell: el.data().sell,
                            currency: el.data().currency,
                            address: el.data().address,
                            condition: conditionStr,
                            images: imgArr,
                            owner: el.data().owner,
                            status: el.data().status
                        });
                    }
                });
                this.items = temp;
                this.loading = false;
            });
        }

        getColor(item: Items){
            return item.status ? 'green' : 'red'
        }

        getStatusString(item: Items){
            return  item.sell ? (item.status ? 'SELLING' : 'SOLD') :(item.status ?'BUYING':'BOUGHT');
        }

        nextPage() {
            if (this.page + 1 <= this.numberOfPages) this.page += 1;
        }

        formerPage() {
            if (this.page - 1 >= 1) this.page -= 1;
        }

        get numberOfPages(): number {
            return Math.ceil(this.selectedItems.length / this.itemsPerPage);
        }

        get selectedItems(): Items[] {
            return this.items;
        }
    }
</script>

<style scoped>

</style>