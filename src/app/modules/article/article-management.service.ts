import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { ArticleModel } from './models/article.model';

const API_ARTICLE_URL = `${environment.apiUrl}/Article`;
const API_FILE_URL = `${environment.apiUrl}/File`;

@Injectable({
    providedIn: 'root',
})
export class ArticleManagementService {

    constructor(private http: HttpClient) { }

    // public methods

    getById(id: number): Observable<ResultModel<ArticleModel>> {
        return this.http.get<ResultModel<ArticleModel>>(`${API_ARTICLE_URL}/${id}`);
    }

    getAll(searchTerm?: string): Observable<ResultModel<ArticleModel[]>> {
        return this.http.get<ResultModel<ArticleModel[]>>(`${API_ARTICLE_URL}/GetAll`,
            { params: new HttpParams().set("FilterText", searchTerm!==undefined ? searchTerm : '')}
        );
    }
    
}
