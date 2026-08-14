import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';

export interface PlanModel {
  id: number;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  period: string;
  periodEn: string;
  properties: string;
  propertiesEn: string;
  sortOrder: number;
  isPopular: boolean;
  isDeleted: boolean;
}

@Injectable({ providedIn: 'root' })
export class PlanManagementService {
  private readonly apiUrl = `${environment.apiUrl}/Plan`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ResultModel<PlanModel[]>> {
    return this.http.get<ResultModel<PlanModel[]>>(`${this.apiUrl}/GetAll`);
  }
  adminGetAll(): Observable<ResultModel<PlanModel[]>> {
    return this.http.get<ResultModel<PlanModel[]>>(`${this.apiUrl}/AdminGetAll`);
  }
  get(id: number): Observable<ResultModel<PlanModel>> {
    return this.http.get<ResultModel<PlanModel>>(`${this.apiUrl}/Get/${id}`);
  }
  save(data: PlanModel): Observable<ResultModel<PlanModel>> {
    return this.http.post<ResultModel<PlanModel>>(`${this.apiUrl}/Save`, data);
  }
  update(data: PlanModel): Observable<ResultModel<PlanModel>> {
    return this.http.post<ResultModel<PlanModel>>(`${this.apiUrl}/Update`, data);
  }
  delete(id: number): Observable<ResultModel<PlanModel>> {
    return this.http.delete<ResultModel<PlanModel>>(`${this.apiUrl}/Delete/${id}`);
  }
}
