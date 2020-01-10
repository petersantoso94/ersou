import { IUser } from '@/models/interfaces/User';
import firebase from "firebase";

export default {
    async FirebaseRegister(data: IUser): Promise<firebase.auth.UserCredential> {
        return await firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
    }
}