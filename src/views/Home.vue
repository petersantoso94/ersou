<template>
    <div class="home">
        <v-app>
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-tabs fixed-tabs dark background-color="blue darken-3" v-model="tabHref">
                            <v-tab v-for="i in tabs" :key="i.component" :href="`#tab-${i.component}`"
                                   @click="chosenTab = i.component">{{ i.displayName }}
                            </v-tab>
                            <v-tab-item v-for="i in tabs" :key="i.component" :value="'tab-' + i.component">
                                <component :is="i.component" :items="items"/>
                            </v-tab-item>
                        </v-tabs>
                    </v-col>
                </v-row>
                <v-row v-if="tabHref && transactionTypeArr.includes(tabHref.split('-')[1])">
                    <v-col cols="12">
                        <v-card class="elevation-4">
                            <v-data-iterator
                                    :items="selectedItems"
                                    :items-per-page.sync="itemsPerPage"
                                    :page="page"
                                    :loading="ersouDataLoading"
                                    :search="search"
                                    :sort-by="sortBy.toLowerCase()"
                                    :sort-desc="sortDesc"
                                    hide-default-footer
                            >
                                <template slot="no-data">
                                    <div></div>
                                </template>
                                <template v-slot:loading>
                                    <v-row class="mx-2">
                                        <v-col v-for="n in 4" :key="n" cols="12" sm="6" md="4" lg="3">
                                            <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
                                        </v-col>
                                    </v-row>
                                </template>
                                <template v-slot:header>
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
                                        <template v-if="$vuetify.breakpoint.mdAndUp">
                                            <v-spacer></v-spacer>
                                            <v-select
                                                    v-model="sortBy"
                                                    flat
                                                    solo-inverted
                                                    hide-details
                                                    :items="keys"
                                                    prepend-inner-icon="search"
                                                    label="Sort by"
                                            ></v-select>
                                            <v-spacer></v-spacer>
                                            <v-btn-toggle v-model="sortDesc" mandatory>
                                                <v-btn large depressed color="blue darken-3" :value="false">
                                                    <v-icon>mdi-arrow-up</v-icon>
                                                </v-btn>
                                                <v-btn large depressed color="blue darken-3" :value="true">
                                                    <v-icon>mdi-arrow-down</v-icon>
                                                </v-btn>
                                            </v-btn-toggle>
                                        </template>
                                    </v-toolbar>
                                </template>
                                <template v-slot:default="props">
                                    <v-row class="mx-2">
                                        <v-col v-for="(item,idx) in props.items" :key="idx" cols="12" sm="6" md="4"
                                               lg="3">
                                            <v-card tile outlined class="elevation-4">
                                                <v-card-title class="subheading" style="font-size:99%">
                                                    {{ item.title |limitTitle }}
                                                    <v-divider></v-divider>
                                                    <v-btn x-small fab dark color="blue"
                                                           @click="showDetailHandler(item.id)">
                                                        <v-icon dark>mdi-format-list-bulleted-square</v-icon>
                                                    </v-btn>
                                                    <v-btn x-small fab dark color="blue"
                                                           @click="showMessageHandler(item.id)" class="mx-1">
                                                        <v-icon dark>mdi-message</v-icon>
                                                    </v-btn>
                                                </v-card-title>
                                                <v-divider></v-divider>
                                                <v-carousel
                                                        hide-delimiters
                                                        show-arrows-on-hover
                                                        :show-arrows="item.images.length > 1"
                                                        v-if="item.images.length > 0"
                                                        height="250"
                                                >
                                                    <v-carousel-item v-for="(n,idx) in item.images" :key="idx">
                                                        <v-img
                                                                :src="n"
                                                                :lazy-src="n"
                                                                aspect-ratio="0.5"
                                                                max-height="250"
                                                                class="grey lighten-2"
                                                                :contain="true"
                                                        >
                                                            <template v-slot:placeholder>
                                                                <v-row class="fill-height ma-0" align="center"
                                                                       justify="center">
                                                                    <v-progress-circular indeterminate
                                                                                         color="grey lighten-5"></v-progress-circular>
                                                                </v-row>
                                                            </template>
                                                        </v-img>
                                                    </v-carousel-item>
                                                </v-carousel>
                                                <v-row justify="end" class="mr-1">
                                                    <v-chip class="mr-2 my-1" color="blue darken-1" text-color="white"
                                                            small>
                                                        <!-- <v-avatar left>
                                                            <v-icon :color="colorObj[item.condition]">mdi-star</v-icon>
                                                        </v-avatar>-->
                                                        {{item.condition}}
                                                    </v-chip>
                                                    <v-chip class="mr-2 my-1" color="blue darken-1" text-color="white"
                                                            small>
                                                        {{item.currency}}
                                                        {{item.price}}
                                                    </v-chip>
                                                </v-row>
                                            </v-card>
                                        </v-col>
                                    </v-row>
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
                            </v-data-iterator>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-dialog v-if="showDetail" v-model="showDetail" class="pa-1" max-width="800px">
                <ItemDetail :detail="chosenItem" :closeDialog="()=>showDetail=false"/>
            </v-dialog>
            <v-dialog v-if="showMessage" v-model="showMessage" class="pa-1" max-width="800px">
                <Message :detail="chosenItem" :closeDialog="()=>showMessage=false"/>
            </v-dialog>
        </v-app>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Watch} from "vue-property-decorator";
    import FBApi from "@/api/firebase";
    import EventBus, {SystemAlert} from "../utils/event-bus";
    import {IUser} from "../models/interfaces/User";
    import {datetimeMixin, brokenImg, titleMixin} from "@/utils/helper";
    import {Items, UpdateFieldOptions} from "@/models/interfaces/Items";
    import {TransactionType, QualityMeasurement} from "@/models/enum/common";
    import {arrConditions} from "@/utils/helper";
    import NewSelling from "@/containers/NewSelling.vue";
    import NewBuying from "@/containers/NewBuying.vue";
    import ItemDetail from "@/components/ItemDetail.vue";
    import Message from "@/containers/Message.vue";
    import MyList from "@/containers/MyList.vue";
    import store from "@/store";

    @Component({
        components: {
            [TransactionType.Sell]: NewSelling,
            [TransactionType.Buy]: NewBuying,
            MyList,
            ItemDetail,
            Message
        },
        mixins: [titleMixin]
    })
    export default class Landing extends Vue {
        items: Items[] = [];
        itemsPerPageArray: number[] = [4, 8, 12];
        page: number = 1;
        chosenItem!: Items;
        chosenId: string = "";
        itemsPerPage: number = 8;
        search: string = "";
        sortDesc: boolean = true;
        showDetail: boolean = false;
        showMessage: boolean = false;
        ersouDataLoading: boolean = false;
        chosenTab: TransactionType = TransactionType.Sell;
        tabHref: string = "tab-" + TransactionType.Sell;
        sortBy: string = "Created";
        currentUser: string = store.getters["User/User"].data.email;
        transactionTypeArr: String[] = Object.values(TransactionType);
        keys: string[] = [
            "Title",
            "Description",
            "Price",
            "Created",
            "Currency",
            "Condition",
            "Address"
        ];
        colorObj: { [x: string]: string } = {
            [QualityMeasurement.Broken]: "red",
            [QualityMeasurement.Poor]: "orange",
            [QualityMeasurement.DailyUsed]: "amber",
            [QualityMeasurement.RarelyUsed]: "yellow",
            [QualityMeasurement.AlmostLikeNew]: "lime",
            [QualityMeasurement.New]: "green"
        };
        tabs: any[] = [{component: TransactionType.Sell, displayName: TransactionType.Sell},
            {component: TransactionType.Buy, displayName: TransactionType.Buy}, {
                component: "MyList",
                displayName: "My Lists"
            }];

        mounted() {
            EventBus.$on("go-to-mylist", () => {
                this.tabHref = "tab-MyList";
            });
            EventBus.$on("show-message", (id: string) => {
                this.showMessageHandler(id);
            });
            EventBus.$on("update-fields", (opt: UpdateFieldOptions) => {
                FBApi.FBUpdateItemsDetail(opt.failCallback, opt).then(() => {
                    EventBus.$emit("show-success", "Successfully Edit Item Status");
                    opt.successCallback();
                });
            });
            this.ersouDataLoading = true;
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
                });
                this.items = temp;
                this.ersouDataLoading = false;
            });
        }

        @Watch("items")
        onItemsChange() {
            this.chosenItem = this.items.filter(el => el.id === this.chosenId)[0];
        }

        nextPage() {
            if (this.page + 1 <= this.numberOfPages) this.page += 1;
        }

        formerPage() {
            if (this.page - 1 >= 1) this.page -= 1;
        }

        updateItemsPerPage(number: number) {
            this.itemsPerPage = number;
        }

        showDetailHandler(id: string) {
            this.chosenId = id;
            this.chosenItem = this.items.filter(el => el.id === id)[0];
            this.showDetail = true;
        }

        showMessageHandler(id: string) {
            this.chosenId = id;
            this.chosenItem = this.items.filter(el => el.id === id)[0];
            this.showMessage = true;
        }

        get numberOfPages(): number {
            return Math.ceil(this.selectedItems.length / this.itemsPerPage);
        }

        get selectedItems(): Items[] {
            return this.items.filter(
                el => el.sell !== (this.chosenTab === TransactionType.Sell) && el.owner !== this.currentUser && el.status
            );
        }
    }
</script>
