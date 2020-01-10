import { IUser } from '@/models/interfaces/User';
import firebase from "firebase";

export default {
    async FirebaseRegister(data: IUser): Promise<firebase.auth.UserCredential | void> {
        return await firebase.auth().createUserWithEmailAndPassword(data.email, data.password).catch(e => console.error(e))
    }
}