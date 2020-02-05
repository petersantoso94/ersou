<template>
	<v-card>
		<v-card-title>Message</v-card-title>
		<v-card-text>{{detail}}</v-card-text>
		<v-card-actions>
			<div class="my-2">
				<v-btn color="primary" fab small dark @click="sendMessage">
					<v-icon>mdi-send</v-icon>
				</v-btn>
			</div>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import { Items } from "../models/interfaces/Items";
import FB from "@/api/firebase";
import { SystemAlert } from "../utils/event-bus";
import { Messages } from "@/models/interfaces/Message";
import store from "../store";
@Component({})
export default class Message extends Vue {
	@Prop(Object) readonly detail!: Items;
	messageList: Messages[] = [];
	detailMessages: string = "";
	currentUser: string = store.getters["User/User"].data.email;

	updateMessagesInItemsCollection() {
		FB.FBUpdateItemMessage(this.detail.id, () =>
			SystemAlert("Document does not exist!")
		);
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
							created: el.data().created,
							from: el.data().from,
							content: el.data().content
						};
						msg.push(temp);
					});
					this.messageList = msg;
				}
			);
		} else {
			//if its the owner, get all the collection list
		}
	}
}
</script>

<style>
</style>