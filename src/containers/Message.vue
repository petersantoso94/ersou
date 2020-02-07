<template>
	<v-card>
		<v-card-title>New Chat</v-card-title>
		<v-container>
			<v-row dense>
				<v-col cols="4">
					<v-list subheader v-if="messageFromArr">
						<v-subheader>Recent chat</v-subheader>
						<v-list-item v-for="pm in messageFromArr" :key="pm" @click="openChatDialogs(pm)">
							<v-list-item-avatar>
								<v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title v-text="pm"></v-list-item-title>
							</v-list-item-content>

							<v-list-item-icon>
								<v-icon :color="messageFromObj[pm] ? 'blue darken-1' : 'grey'">chat_bubble</v-icon>
							</v-list-item-icon>
						</v-list-item>
					</v-list>
				</v-col>
				<v-col cols="8">
					<v-container v-if="loadingChat">
						<v-row class="mx-1">
							<v-col v-for="n in 4" :key="n" cols="12">
								<v-skeleton-loader class="mx-auto" type="list-item-two-line"></v-skeleton-loader>
							</v-col>
						</v-row>
					</v-container>
					<v-container fluid v-show="selectedChatOwner && !loadingChat">
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
							<v-text-field
								placeholder="Type your message here"
								v-on:keyup.enter="sendMessage"
								v-model="content"
							></v-text-field>
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
import { Messages, MessageOptions } from "@/models/interfaces/Message";
import store from "../store";
@Component({})
export default class Message extends Vue {
	@Prop(Object) readonly detail!: Items;
	messageList: Messages[] = [];
	messageFromObj: {
		[name: string]: boolean;
	} = {};
	loadingChat: boolean = false;
	detailMessages: string = "";
	content: string = "";
	currentUser: string = store.getters["User/User"].data.email;
	selectedChatOwner: string = "";

	get messageFromArr() {
		let mes: string[] = [];
		if (this.detail.owner !== this.currentUser) {
			mes.push(this.detail.owner);
		} else {
			this.detail.messages.split(",,").forEach(el => {
				if (el !== this.currentUser) {
					mes.push(el);
				}
			});
		}
		return mes;
	}

	updateMessagesInItemsCollection() {
		FB.FBUpdateItemMessage(this.detail.id, () =>
			SystemAlert("Document does not exist!")
		);
	}
	openChatDialogs(pm: string) {
		this.loadingChat = true;
		this.selectedChatOwner =
			this.detail.owner !== this.currentUser ? this.currentUser : pm;
		const newMesObj = { ...this.messageFromObj };
		Object.keys(newMesObj).forEach(key => {
			newMesObj[key] = false;
		});
		newMesObj[pm] = true;
		this.messageFromObj = newMesObj;
		const user =
			this.detail.owner !== this.currentUser ? this.currentUser : pm;
		FB.FBChatsCollection(this.detail.id, user).onSnapshot(data => {
			if (data.empty) {
				SystemAlert("Chats empty, start new chat");
				//start a new chat, build new collection
			}
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
			this.scrollToEnd();
			this.loadingChat = false;
		});
	}
	scrollToEnd() {
		if (this.messageList.length > 0)
			this.$nextTick(() => {
				const container = this.$el.querySelector(".chat-container");
				container!.scrollTop = container!.scrollHeight;
			});
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
		console.log(this.selectedChatOwner);
		FB.FBSetChatPerItemDoc(
			this.content,
			this.detail.id,
			this.selectedChatOwner
		).then(() => {});
		this.content = "";
	}
	setChatOwner() {
		this.messageFromObj = {};
		if (this.detail.owner !== this.currentUser) {
			this.messageFromObj[this.detail.owner] = true;
			this.openChatDialogs(this.detail.owner);
		} else {
			this.detail.messages.split(",,").forEach(el => {
				if (el !== this.currentUser) {
					this.messageFromObj[el] = false;
				}
			});
		}
	}
	mounted() {
		this.setChatOwner();
		console.log(this.detail);
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