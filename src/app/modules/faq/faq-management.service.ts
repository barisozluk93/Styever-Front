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
    
}
