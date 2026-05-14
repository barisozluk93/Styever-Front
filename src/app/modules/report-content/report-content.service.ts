import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { ReportContentModel } from './models/report-content.model';

const API_REPORT_CONTENT_URL = `${environment.apiUrl}/ReportContent`;

@Injectable({
    providedIn: 'root',
})
export class ReportContentService {

    constructor(private http: HttpClient) { }

    // public methods
    submit(data: ReportContentModel): Observable<ResultModel<ReportContentModel>> {
        return this.http.post<ResultModel<ReportContentModel>>(`${API_REPORT_CONTENT_URL}/Save`, data);
    }
    
}
