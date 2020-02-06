<template>
	<v-card>
		<v-card-title>New Chat</v-card-title>
		<v-container>
			<v-row dense>
				<v-col cols="4">
					<v-list subheader v-if="messageFromArr">
						<v-subheader>Recent chat</v-subheader>
						<v-list-item v-for="pm in messageFromArr" :key="pm">
							<v-list-item-avatar>
								<v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title v-text="pm"></v-list-item-title>
							</v-list-item-content>

							<v-list-item-icon>
								<v-icon :color="messageFromObj[pm].active ? 'deep-purple accent-4' : 'grey'">chat_bubble</v-icon>
							</v-list-item-icon>
						</v-list-item>
					</v-list>
				</v-col>
				<v-col cols="8">
					<v-container fluid>
						<v-row class="mx-1 chat-container" dense>
							<v-col
								cols="12"
								v-for="chat in messageList"
								:key="chat.id"
								:class="chat.from === currentUser?'text-right':'text-left'"
							>
								<p class="chat-owner">{{chat.from}}</p>

								<v-chip class="text-wrap chat-content">
									{{chat.content}}
									<br />
								</v-chip>
								<p class="chat-time">{{chat.created | moment("from", "now")}}</p>
							</v-col>
						</v-row>
						<v-row class="mx-1" dense>
							<v-text-field placeholder="Type your message here" v-on:keyup.enter="sendMessage"></v-text-field>
						</v-row>
					</v-container>
				</v-col>
			</v-row>
		</v-container>
	</v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import { Items } from "../models/interfaces/Items";
import { datetimeMixin } from "@/utils/helper";
import FB from "@/api/firebase";
import { SystemAlert } from "../utils/event-bus";
import { Messages } from "@/models/interfaces/Message";
import store from "../store";
@Component({})
export default class Message extends Vue {
	@Prop(Object) readonly detail!: Items;
	messageList: Messages[] = [];
	messageFromObj: { [name: string]: { [active: string]: boolean } } = {};
	messageFromArr: string[] = [];
	detailMessages: string = "";
	currentUser: string = store.getters["User/User"].data.email;

	updateMessagesInItemsCollection() {
		FB.FBUpdateItemMessage(this.detail.id, () =>
			SystemAlert("Document does not exist!")
		);
	}
	updated() {
		const container = this.$el.querySelector(".chat-container");
		container!.scrollTop = container!.scrollHeight;
	}
	sendMessage() {
		if (
			(!this.detail.messages && !this.detailMessages) ||
			(this.detail.messages &&
				!this.detailMessages &&
				!this.detail.messages.match(
					new RegExp("(" + this.currentUser + ")", "gm")
				))
		) {
			this.detailMessages = this.currentUser;
			this.updateMessagesInItemsCollection();
		}
	}
	mounted() {
		if (this.detail.owner !== this.currentUser) {
			// if not the owner, get only its own message with the owner
			FB.FBChatsCollection(this.detail.id, this.currentUser).onSnapshot(
				data => {
					if (!data) SystemAlert("Items collection empty");
					let msg: Messages[] = [];
					data.forEach(el => {
						const temp = {
							id: el.id,
							created: datetimeMixin.filters.timestampToDateAndTime(
								el.data().created.seconds
							),
							from: el.data().from,
							content: el.data().content
						};
						msg.push(temp);
					});
					this.messageList = msg;
				}
			);
			this.messageFromObj[this.detail.owner] = { ["active"]: false };
			this.messageFromArr.push(this.detail.owner);
		} else {
			//if its the owner, get all the collection list
		}
	}
}
</script>

<style>
.chat-content {
	max-width: 50%;
	height: auto !important;
}
.chat-owner {
	font-size: 70%;
	margin-bottom: -1px !important;
	font-weight: bold;
}
.chat-time {
	font-size: 70%;
	margin-bottom: -1px !important;
}
.chat-container {
	max-height: 40vh;
	overflow: auto;
}
</style>