import { MemoryModel } from "./memory.model";

export class MemoryFileModel {
    id: number;
    fileId: number;
    fileResult?: any;
    memoryId: number;
    memory?: MemoryModel;
    fileName?: string;
    isPrimary: boolean;
    date?: string;
}