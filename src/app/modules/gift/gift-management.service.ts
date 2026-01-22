import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { PagingResult } from 'src/app/models/paging-result.model';
import { GiftModel } from './models/gift.model';

const API_GIFT_URL = `${environment.apiUrl}/User`;

@Injectable({
    providedIn: 'root',
})
export class GiftManagementService {

    constructor(private http: HttpClient) { }

    addGift(data: GiftModel): Observable<ResultModel<GiftModel>> {
        return this.http.post<ResultModel<GiftModel>>(`${API_GIFT_URL}/BuyGiftPackage`, data);
    }
}
