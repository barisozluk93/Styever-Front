import { MemoryModel } from "./memory.model";

export class MemoryCommentModel {
    id: number;
    comment?: string;
    userId?: number;
    userName?: string;
    memoryId: number;
    memory?: MemoryModel;
    date?: string;
    nameSurname?: string;
    isApproved: boolean;
    userAvatar?: any;
    fileUrl?: string;
    own?: boolean;
}