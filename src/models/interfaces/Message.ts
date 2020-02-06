
export interface Messages {
    id: string;
    created: string;
    from: string;
    content: string;
}

export interface MessageOptions {
    from: string;
    created: firebase.firestore.Timestamp;
    content: string;
}