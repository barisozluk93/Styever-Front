import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResultModel } from 'src/app/models/result.model';

export interface DashboardTrendPoint {
  date: string;
  newUsers: number;
  membershipRevenue: number;
  giftRevenue: number;
}


export interface DashboardRecentActivity {
  type: 'user' | 'payment' | 'gift' | 'memory' | string;
  name?: string | null;
  actorName?: string | null;
  amount?: number | null;
  date: string;
}

export interface DashboardResponse {
  startDate: string;
  endDate: string;
  totalUsers: number;
  activeMembers: number;
  totalMemories: number;
  periodMemories: number;
  originUsers: number;
  heartUsers: number;
  familyUsers: number;
  membershipRevenue: number;
  giftRevenue: number;
  totalRevenue: number;
  totalGifts: number;
  giftVoucherUsers: number;
  regularUsers: number;
  expiredTrialUsers: number;
  expiredPackageUsers: number;
  totalLikes: number;
  totalComments: number;
  totalCandles: number;
  averageInteractionsPerMemory: number;
  reportedContentCount: number;
  trend: DashboardTrendPoint[];
  recentActivities: DashboardRecentActivity[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/Dashboard`;
  constructor(private http: HttpClient) {}

  getDashboard(startDate: string, endDate: string): Observable<ResultModel<DashboardResponse>> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<ResultModel<DashboardResponse>>(`${this.apiUrl}/Get`, { params });
  }
}
