import { IUser } from '@/models/interfaces/User';
import { db, storageRef } from "@/main"
import * as firebase from "firebase/app";
import 'firebase/auth'
import { Items, ItemsOptions } from '@/models/interfaces/Items';
import store from '@/store';
import { MessageOptions } from '@/models/interfaces/Message';


export default {
    async FBRegister(data: IUser): Promise<firebase.auth.UserCredential> {
        return await firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
    },
    async FBLogin(data: IUser): Promise<firebase.auth.UserCredential> {
        return await firebase.auth().signInWithEmailAndPassword(data.email, data.password)
    },
    async FBLogout(): Promise<void> {
        return await firebase.auth().signOut()
    },
    FBUpdateUserInfo(displayName: string, photoUrl: string = "https://randomuser.me/api/portraits/men/81.jpg"): Promise<void> {
        const user = firebase.auth().currentUser
        return user!.updateProfile({
            displayName: displayName,
            photoURL: photoUrl
        })
    },
    FBItemsCollection(): firebase.firestore.Query<firebase.firestore.DocumentData> {
        return db.collection('items').orderBy('created')
    },
    FBChatsCollection(docPath: string, currentUser: string): firebase.firestore.Query<firebase.firestore.DocumentData> {
        return db.collection('items').doc(docPath).collection(currentUser).orderBy('created')
    },
    async FBSetItemsDoc(payload: ItemsOptions): Promise<void> {
        return db.collection("items").doc().set(payload)
    },
    async FBSetChatPerItemDoc(content: string, docPath: string, replyTo: string): Promise<void> {
        const currentUser: string = store.getters["User/User"].data.email;
        const msgOpt: MessageOptions = {
            from: currentUser,
            created: firebase.firestore.Timestamp.fromDate(new Date()),
            content
        }
        return db.collection("items").doc(docPath).collection(replyTo).doc().set(msgOpt)
    },
    async FBUpdateItemMessage(docPath: string, failCallback: () => void): Promise<void> {
        const dbRef = db.collection("items").doc(docPath)
        const currentUser: string = store.getters["User/User"].data.email;
        return db.runTransaction(function (transaction: firebase.firestore.Transaction) {
            return transaction.get(dbRef).then(
                (doc) => {
                    if (!doc.exists) {
                        failCallback()

                    }

                    let messages = doc.data()!.messages || "";
                    if (
                        !messages.match(
                            new RegExp("(" + currentUser + ")", "gm")
                        )
                    ) {
                        messages +=
                            (messages !== "" ? ",," : "") + currentUser;
                    }
                    transaction.update(dbRef, { messages });
                }
            )
        })
    },
    FBUploadImageToStorage(file: File): firebase.storage.UploadTask {
        const metadata = { 'contentType': file.type }
        return storageRef.child('images/' + Date.now() + "-" + file.name).put(file, metadata)
    }
}