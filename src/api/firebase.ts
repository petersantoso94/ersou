import { IUser } from '@/models/interfaces/User';
import { db } from "@/main"
import * as firebase from "firebase/app";
import 'firebase/auth'


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
    }
}