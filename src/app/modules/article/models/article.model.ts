export class ArticleModel {
    id: number;
    header: string;
    fileId: number;
    isDeleted: boolean;
    headerEn?: string;
    subHeader: string;
    subHeaderEn: string;
    file?: any;
    fileUrl?: string;
    content: string;
    contentEn: string;
  }
  