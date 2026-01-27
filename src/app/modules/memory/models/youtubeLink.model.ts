import { FileModel } from "src/app/models/file.model";
import { MemoryModel } from "./memory.model";

export class MemoryYoutubeLinkModel {
    id: number;
    memoryId: number;
    memory?: MemoryModel;
    link: string;
    isDeleted: boolean;
}