import { QualityMeasurement } from '../enum/common';

export interface Items {
    title: string;
    desc: string;
    price: number;
    currency: string;
    address: string;
    condition: QualityMeasurement;
    created: string;
    sell: boolean;
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
}