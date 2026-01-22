import { MemoryModel } from "./memory.model";

export class MemoryCandleModel {
    id: number;
    userId: number;
    userName?: string;
    memoryId: number;
    memory?: MemoryModel;
    shelter?: string;
    donation?: number;
    date?: string;
    isDeleted?: boolean;
    userAvatar?: any;
    fileUrl?: string;
}