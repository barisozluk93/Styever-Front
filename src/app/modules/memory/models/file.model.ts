import { FileModel } from "src/app/models/file.model";
import { MemoryModel } from "./memory.model";

export class MemoryFileModel {
    id: number;
    fileId: number;
    file?: FileModel;
    memoryId: number;
    memory?: MemoryModel;
    fileName?: string;
    isPrimary: boolean;
    date?: string;
    fileUrl?: string;
}