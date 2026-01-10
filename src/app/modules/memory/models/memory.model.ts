import { FileModel } from "src/app/models/file.model";
import { CategoryModel } from "./category.model";
import { MemoryCommentModel } from "./comment.model";
import { MemoryFileModel } from "./file.model";
import { MemoryLikeModel } from "./like.model";

export class MemoryModel {
    id: number;
    name: string;
    userId: number;
    isDeleted: boolean;
    categoryName?: string;
    categoryId: number;
    category?: CategoryModel;
    comments?: MemoryCommentModel[];
    commentsCount: number;
    likes?: MemoryLikeModel[];
    likesCount: number;
    files?: MemoryFileModel[];
    userName?: string;
    userCityCountry?: string;
    birthDate: string;
    birthDateStr: string;
    deathDate: string;
    deathDateStr: string;
    postDate?: string;
    postDateStr?: string;
    text: string;
    fileResult?: any;
    fileUrl?: string;
    ownLike?: boolean;
    isPrivate: boolean;
    isOpenToComment: boolean;
  }
  