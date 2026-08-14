import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { PagingResult } from 'src/app/models/paging-result.model';
import { FAQModel } from './models/faq.model';

const API_FAQ_URL = `${environment.apiUrl}/FAQ`;

@Injectable({
    providedIn: 'root',
})
export class FAQManagementService {

    constructor(private http: HttpClient) { }

    // public methods
    getAll(): Observable<ResultModel<FAQModel[]>> {
        return this.http.get<ResultModel<FAQModel[]>>(`${API_FAQ_URL}/GetAll`);
    }

    paginate(pageNumber: number, pageSize: number, filters: Record<string, any> = {}): Observable<ResultModel<PagingResult<FAQModel[]>>> {
        let params = new HttpParams().set('PageNumber', pageNumber).set('PageSize', pageSize);
        Object.keys(filters || {}).forEach(key => {
            const value = filters[key];
            if (value === undefined || value === null || value === '') return;
            params = params.set(key, String(value));
        });

        return this.http.get<ResultModel<PagingResult<FAQModel[]>>>(`${API_FAQ_URL}/Paginate`, { params });
    }

    save(data: FAQModel): Observable<ResultModel<FAQModel>> {
        return this.http.post<ResultModel<FAQModel>>(`${API_FAQ_URL}/Save`, data);
    }

    update(data: FAQModel): Observable<ResultModel<FAQModel>> {
        return this.http.post<ResultModel<FAQModel>>(`${API_FAQ_URL}/Update`, data);
    }

    delete(id: number): Observable<ResultModel<FAQModel>> {
        return this.http.delete<ResultModel<FAQModel>>(`${API_FAQ_URL}/Delete/${id}`);
    }
    
}
