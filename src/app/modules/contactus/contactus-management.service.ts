import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { ContactUsModel } from './models/contactus.model';

const API_CONTACT_US_URL = `${environment.apiUrl}/ContactUs`;

@Injectable({
    providedIn: 'root',
})
export class ContactUsManagementService {

    constructor(private http: HttpClient) { }

    // public methods
    submit(data: ContactUsModel): Observable<ResultModel<ContactUsModel>> {
        return this.http.post<ResultModel<ContactUsModel>>(`${API_CONTACT_US_URL}/Save`, data);
    }
    
}
