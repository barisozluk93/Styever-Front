import { UserModel } from "./user.model";

export class UserAddressModel {
    id: number;
    userId?: number;
    user?: UserModel;
    isDeleted: boolean;
    address: string;
    country: string;
    city: string;
    district: string;
    addressHeader: string;
    selected?: boolean;
}