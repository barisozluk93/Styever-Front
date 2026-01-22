import { FileModel } from "src/app/models/file.model";
import { UserAddressModel } from "./user-address.model";

export class UserModel {
    id: number;
    name: string;
    surname: string;
    nameSurname: string;
    phone: string;
    email: string;
    password?: string;
    username: string;
    createdDate: string;
    userAddress: UserAddressModel;
    trialExpirationDate: string;
    expirationDate: string;
    isTrial: boolean;
    isDeleted: boolean;
    isSystemData: boolean;
    roles: number[];
    fileId?: number;
    file?: FileModel;
    isActive: boolean;
    voucher?: string;
}