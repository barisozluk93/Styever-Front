export class GiftModel {
    id: number;
    userId?: number;
    senderEmail?: string;
    receiverEmail: string;
    message: string;
    planId: number;
    price: number;
    date?: string;
    isDeleted?: boolean;
    voucher?: string;
}