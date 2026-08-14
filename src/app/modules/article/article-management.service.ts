import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { PagingResult } from 'src/app/models/paging-result.model';
import { FileModel } from 'src/app/models/file.model';
import { ArticleModel } from './models/article.model';

const API_ARTICLE_URL = `${environment.apiUrl}/Article`;
const API_FILE_URL = `${environment.apiUrl}/File`;

@Injectable({
    providedIn: 'root',
})
export class ArticleManagementService {

    constructor(private http: HttpClient) { }

    // public methods

    paginate(pageNumber: number, pageSize: number, filters: Record<string, any> = {}): Observable<ResultModel<PagingResult<ArticleModel[]>>> {
        let params = new HttpParams().set('PageNumber', pageNumber).set('PageSize', pageSize);
        Object.keys(filters || {}).forEach(key => {
            const value = filters[key];
            if (value === undefined || value === null || value === '') return;
            params = params.set(key, String(value));
        });

        return this.http.get<ResultModel<PagingResult<ArticleModel[]>>>(`${API_ARTICLE_URL}/Paginate`, { params });
    }

    save(data: ArticleModel): Observable<ResultModel<ArticleModel>> {
        return this.http.post<ResultModel<ArticleModel>>(`${API_ARTICLE_URL}/Save`, data);
    }

    update(data: ArticleModel): Observable<ResultModel<ArticleModel>> {
        return this.http.post<ResultModel<ArticleModel>>(`${API_ARTICLE_URL}/Update`, data);
    }

    delete(id: number): Observable<ResultModel<ArticleModel>> {
        return this.http.delete<ResultModel<ArticleModel>>(`${API_ARTICLE_URL}/Delete/${id}`);
    }

    upload(data: FormData): Observable<ResultModel<FileModel>> {
        return this.http.post<ResultModel<FileModel>>(`${API_FILE_URL}/Save`, data);
    }

    getById(id: number): Observable<ResultModel<ArticleModel>> {
        return this.http.get<ResultModel<ArticleModel>>(`${API_ARTICLE_URL}/${id}`);
    }

    getAll(searchTerm?: string, language?: string): Observable<ResultModel<ArticleModel[]>> {
        return this.http.get<ResultModel<ArticleModel[]>>(`${API_ARTICLE_URL}/GetAll`,
            { params: new HttpParams().set("FilterText", searchTerm!==undefined ? searchTerm : '').set("Language", language!==undefined ? language : '')}
        );
    }
    
}
