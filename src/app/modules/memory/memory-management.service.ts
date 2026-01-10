import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { PagingResult } from 'src/app/models/paging-result.model';
import { FileModel } from 'src/app/models/file.model';
import { MemoryModel } from './models/memory.model';
import { MemoryCommentModel } from './models/comment.model';
import { MemoryLikeModel } from './models/like.model';
import { MemoryFileModel } from './models/file.model';

const API_MEMORY_URL = `${environment.apiUrl}/Memory`;
const API_FILE_URL = `${environment.apiUrl}/File`;

@Injectable({
    providedIn: 'root',
})
export class MemoryManagementService {

    constructor(private http: HttpClient) { }

    // public methods

    paging(pageNumber: number, pageSize: number, filterText?: string, categoryId?: number): Observable<ResultModel<PagingResult<MemoryModel[]>>> {
        return this.http.get<ResultModel<PagingResult<MemoryModel[]>>>(`${API_MEMORY_URL}/Paginate`, 
            { params: new HttpParams().set("PageNumber", pageNumber).set("PageSize", pageSize).set("FilterText", filterText!==undefined ? filterText : '').set("CategoryId", categoryId!==undefined ? categoryId : '') });
    }

    getById(id: number): Observable<ResultModel<MemoryModel>> {
        return this.http.get<ResultModel<MemoryModel>>(`${API_MEMORY_URL}/${id}`);
    }

    save(data: MemoryModel): Observable<ResultModel<MemoryModel>> {
        return this.http.post<ResultModel<MemoryModel>>(`${API_MEMORY_URL}/Save`, data);
    }

    edit(data: MemoryModel): Observable<ResultModel<MemoryModel>> {
        return this.http.post<ResultModel<MemoryModel>>(`${API_MEMORY_URL}/Update`, data);
    }

    upload(data: FormData): Observable<ResultModel<FileModel>> {
        return this.http.post<ResultModel<FileModel>>(`${API_FILE_URL}/Save`, data);
    }

    deleteFile(id: number): Observable<ResultModel<FileModel>> {
        return this.http.delete<ResultModel<FileModel>>(`${API_FILE_URL}/Delete/${id}`);
    }

    memoryFileDelete(id: number): Observable<ResultModel<MemoryFileModel>> {
        return this.http.delete<ResultModel<MemoryFileModel>>(`${API_MEMORY_URL}/MemoryFileDelete/${id}`);
    }

    memoryFileAdd(memoryFile: MemoryFileModel): Observable<ResultModel<MemoryFileModel>> {
        return this.http.post<ResultModel<MemoryFileModel>>(`${API_MEMORY_URL}/MemoryFileAdd`, memoryFile);
    }

    addComment(data: MemoryCommentModel) : Observable<ResultModel<MemoryCommentModel>> {
        return this.http.post<ResultModel<MemoryCommentModel>>(`${API_MEMORY_URL}/AddComment`, data);
    }

    deleteComment(commentId: number) : Observable<ResultModel<MemoryCommentModel>> {
        return this.http.get<ResultModel<MemoryCommentModel>>(`${API_MEMORY_URL}/DeleteComment/${commentId}`,);
    }

    like(data: MemoryLikeModel) : Observable<ResultModel<MemoryLikeModel>> {
        return this.http.post<ResultModel<MemoryLikeModel>>(`${API_MEMORY_URL}/Like`, data);
    }

    dislike(userId: number, memoryId: number) : Observable<ResultModel<MemoryLikeModel>> {
        return this.http.get<ResultModel<MemoryLikeModel>>(`${API_MEMORY_URL}/Dislike/${memoryId}/${userId}`,);
    }

    commentAll(memoryId: number): Observable<ResultModel<MemoryCommentModel[]>> {
        return this.http.get<ResultModel<MemoryCommentModel[]>>(`${API_MEMORY_URL}/CommentAll/${memoryId}`);
    }

    likeAll(memoryId: number): Observable<ResultModel<MemoryLikeModel[]>> {
        return this.http.get<ResultModel<MemoryLikeModel[]>>(`${API_MEMORY_URL}/LikeAll/${memoryId}`);
    }

    getMemoryCount(userId: number): Observable<ResultModel<number>> {
        return this.http.get<ResultModel<number>>(`${API_MEMORY_URL}/GetMemoryCount/${userId}`);
    }

    setMemoryFileIsPrimary(memoryFileId: number): Observable<ResultModel<boolean>> {
        return this.http.get<ResultModel<boolean>>(`${API_MEMORY_URL}/SetMemoryFileIsPrimary/${memoryFileId}`);
    }
    
}
