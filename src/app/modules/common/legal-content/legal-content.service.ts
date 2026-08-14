import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';
import { PagingResult } from 'src/app/models/paging-result.model';

export interface LegalContentModel {
  id: number;
  slug: string;
  category: 'Legal' | 'Community' | string;
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  sortOrder: number;
  isDeleted: boolean;
}

@Injectable({ providedIn: 'root' })
export class LegalContentService {
  private readonly apiUrl = `${environment.apiUrl}/LegalContent`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ResultModel<LegalContentModel[]>> { return this.http.get<ResultModel<LegalContentModel[]>>(`${this.apiUrl}/GetAll`); }
  paginate(pageNumber: number, pageSize: number, filters: Record<string, any> = {}): Observable<ResultModel<PagingResult<LegalContentModel[]>>> {
    let params = new HttpParams().set('PageNumber', String(pageNumber)).set('PageSize', String(pageSize));
    Object.keys(filters || {}).forEach(key => {
      const value = filters[key];
      if (value === undefined || value === null || value === '') return;
      params = params.set(key, String(value));
    });
    return this.http.get<ResultModel<PagingResult<LegalContentModel[]>>>(`${this.apiUrl}/Paginate`, { params });
  }
  adminGetAll(): Observable<ResultModel<LegalContentModel[]>> { return this.http.get<ResultModel<LegalContentModel[]>>(`${this.apiUrl}/AdminGetAll`); }
  get(id: number): Observable<ResultModel<LegalContentModel>> { return this.http.get<ResultModel<LegalContentModel>>(`${this.apiUrl}/Get/${id}`); }
  getBySlug(slug: string): Observable<ResultModel<LegalContentModel>> { return this.http.get<ResultModel<LegalContentModel>>(`${this.apiUrl}/GetBySlug/${encodeURIComponent(slug)}`); }
  save(data: LegalContentModel): Observable<ResultModel<LegalContentModel>> { return this.http.post<ResultModel<LegalContentModel>>(`${this.apiUrl}/Save`, data); }
  update(data: LegalContentModel): Observable<ResultModel<LegalContentModel>> { return this.http.post<ResultModel<LegalContentModel>>(`${this.apiUrl}/Update`, data); }
  delete(id: number): Observable<ResultModel<LegalContentModel>> { return this.http.delete<ResultModel<LegalContentModel>>(`${this.apiUrl}/Delete/${id}`); }
}
