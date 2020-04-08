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
                        <template v-slot:item.actions="{ item }">
                            <v-btn x-small fab dark color="blue"
                                   @click="openMessage(item)" class="mr-2">
                                <v-badge :color="getIsMessageUnread(item)?'red':''" dot>
                                    <v-icon dark>mdi-message</v-icon>
                                </v-badge>
                            </v-btn>
                            <v-btn x-small fab dark color="red"
                                   @click="deleteItem(item)" class="mr-2">
                                <v-icon dark>mdi-delete</v-icon>
                            </v-btn>
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
    import FBApi from "@/api/firebase";
    import EventBus from "@/utils/event-bus";
    import store from "@/store";
    import {TransactionType} from "@/models/enum/common";

    @Component({})
    export default class MyList extends Vue {
        @Prop(Array) readonly items!: Items[];
        selectedItem: Items[] = [];
        isSelling: boolean = true;
        itemsPerPageArray: number[] = [10, 20, 50];
        itemsPerPage: number = 10;
        page: number = 1;
        loading: boolean = false;
        search: string = "";
        currentUser: string = store.getters["User/User"].data.email;
        itemHeaders = [
            {
                text: 'Your Item',
                align: 'start',
                value: 'title',
            }, {
                text: 'Description',
                align: 'start',
                value: 'description',
            },
            {text: 'Currency', value: 'currency'},
            {text: 'Price', value: 'price'},
            {text: 'Address', value: 'address'},
            {text: 'Condition', value: 'condition'},
            {text: 'Status', value: 'sell'},
            {text: 'Actions', value: 'actions', sortable: false},
        ];


        openMessage(item: Items) {
            EventBus.$emit('show-message', item.id)
        }

        deleteItem(item: Items) {
            console.log('deleting', item)
        }

        getColor(item: Items) {
            return item.status ? 'green' : 'red'
        }

        getStatusString(item: Items) {
            return item.sell ? (item.status ? 'SELLING' : 'SOLD') : (item.status ? 'BUYING' : 'BOUGHT');
        }

        getIsMessageUnread(item: Items): boolean {
            let isUnread: boolean = false;
            item.messages.split(",,").forEach(el => {
                const userEmail = el.split(":")[0];
                const notReadMessage = el.split(":")[1];
                if (notReadMessage && +notReadMessage > 0 && userEmail !== this.currentUser) {
                    isUnread = true;
                }
            });
            return isUnread
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
            return this.items.filter(
                el => el.owner === this.currentUser
            );
        }
    }
</script>

<style scoped>

</style>