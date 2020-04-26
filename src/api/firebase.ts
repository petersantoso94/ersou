import { IUser } from '@/models/interfaces/User';
import { db, storageRef } from "@/main"
import * as firebase from "firebase/app";
import 'firebase/auth'
import {Fields, Items, ItemsOptions, UpdateFieldOptions} from '@/models/interfaces/Items';
import store from '@/store';
import { MessageOptions } from '@/models/interfaces/Message';


export default {
    async FBRegister(data: IUser): Promise<firebase.auth.UserCredential> {
        return await firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
    },
    async FBLogin(data: IUser): Promise<firebase.auth.UserCredential> {
        return await firebase.auth().signInWithEmailAndPassword(data.email, data.password)
    },
    async FBPhoneLogin(phoneNumber: string, appVerifier: firebase.auth.ApplicationVerifier):Promise<firebase.auth.ConfirmationResult>{
        return await firebase.auth().signInWithPhoneNumber(phoneNumber,appVerifier);
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
    async FBSetChatPerItemDoc(content: string, docPath: string, replyTo: string, failCallback: () => void = () => { }): Promise<void> {
        const currentUser: string = store.getters["User/User"].data.email;
        const msgOpt: MessageOptions = {
            from: currentUser,
            created: firebase.firestore.Timestamp.fromDate(new Date()),
            content
        }

        // update the not-read yet message
        const dbRef = db.collection("items").doc(docPath)
        db.runTransaction(function (transaction: firebase.firestore.Transaction) {
            return transaction.get(dbRef).then(
                (doc) => {
                    if (!doc.exists) {
                        failCallback()

                    }

                    let messages = doc.data()!.messages || "";
                    let msgArr = messages.split(",,")

                    messages = msgArr.map((msg: string) => {
                        const msgFrom = msg.split(":")[0]
                        if (msgFrom === currentUser) return msgFrom + ":1"
                        else return msg
                    }).join(",,")
                    transaction.update(dbRef, { messages });
                }
            )
        })
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
                            (messages !== "" ? ",," : "") + currentUser + ":1";
                    }
                    transaction.update(dbRef, { messages });
                }
            )
        })
    },
    async FBUpdateItemsDetail(failCallback: () => void, option: UpdateFieldOptions) : Promise<void>{
        const dbRef = db.collection("items").doc(option.id);
        const currentUser: string = store.getters["User/User"].data.email;
        return db.runTransaction(function (transaction: firebase.firestore.Transaction) {
            return transaction.get(dbRef).then(
                (doc) => {
                    if (!doc.exists) {
                        failCallback()

                    }
                    let owner = doc.data()!.owner || "";
                    if(!owner || owner !== currentUser){
                        failCallback()
                    }

                    option.fields.forEach((obj)=>{
                        transaction.update(dbRef, { [obj.field]: obj.newVal });
                    });


                }
            )
        })
    },
    async FBReadMessage(docPath: string, pm: string, failCallback: () => void): Promise<void> {
        const dbRef = db.collection("items").doc(docPath)
        return db.runTransaction(function (transaction: firebase.firestore.Transaction) {
            return transaction.get(dbRef).then(
                (doc) => {
                    if (!doc.exists) {
                        failCallback()

                    }

                    let messages = doc.data()!.messages || "";
                    let msgArr = messages.split(",,")

                    messages = msgArr.map((msg: string) => {
                        const msgFrom = msg.split(":")[0]
                        if (msgFrom === pm) return msgFrom + ":0"
                        else return msg
                    }).join(",,")
                    transaction.update(dbRef, { messages });
                }
            )
        })
    },
    FBUploadImageToStorage(file: File): firebase.storage.UploadTask {
        const metadata = { 'contentType': file.type };
        return storageRef.child('images/' + Date.now() + "-" + file.name).put(file, metadata)
    }
}