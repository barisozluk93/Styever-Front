import { MemoryModel } from "./memory.model";

export class MemoryLikeModel {
    id: number;
    userId: number;
    userName?: string;
    memoryId: number;
    memory?: MemoryModel;
    date?: string;
    isDeleted?: boolean;
    userAvatar?: any;
    fileUrl?: string;
}