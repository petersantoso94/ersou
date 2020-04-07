import { QualityMeasurement } from '../enum/common';

export interface Items {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    address: string;
    condition: QualityMeasurement;
    created: string;
    sell: boolean;
    images: string[];
    owner: string;
    messages: string;
    status: boolean;
}

export interface ItemsOptions {
    title: string;
    description: string;
    price: number;
    currency: string;
    address: string;
    condition: number;
    images: string;
    created: firebase.firestore.Timestamp;
    sell: boolean;
    owner: string;
    status: boolean;
    messages: string;
}