import { IUser } from '@/models/interfaces/User';
import { db, storageRef } from "@/main"
import * as firebase from "firebase/app";
import 'firebase/auth'
import { Items, ItemsOptions } from '@/models/interfaces/Items';
import store from '@/store';


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
    FBItemsCollection(): firebase.firestore.Query<firebase.firestore.DocumentData> {
        return db.collection('items').orderBy('created')
    },
    FBChatsCollection(docPath: string, currentUser: string): firebase.firestore.Query<firebase.firestore.DocumentData> {
        return db.collection('items').doc(docPath).collection(currentUser).orderBy('created')
    },
    async FBSetItemsDoc(payload: ItemsOptions): Promise<void> {
        return db.collection("items").doc().set(payload)
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