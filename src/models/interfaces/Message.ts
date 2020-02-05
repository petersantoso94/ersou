
export interface Messages {
    id: string;
    created: firebase.firestore.Timestamp;
    from: string;
    content: string;
}