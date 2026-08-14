import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardRecentActivity, DashboardService, DashboardTrendPoint } from './dashboard.service';
import { TranslateService } from '@ngx-translate/core';

interface DashboardPackageStat {
  name: 'Origin' | 'Heart' | 'Family';
  userCount: number;
  percentage: number;
  icon: string;
  subtitleKey: string;
}

type DashboardRange = '7d' | '15d' | '1m' | '6m' | 'custom';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  totalUsers = 0;
  activeMembers = 0;
  totalRevenue = 0;
  periodRevenue = 0;
  totalMemories = 0;
  periodMemories = 0;
  totalGiftPackages = 0;
  regularMembershipRevenue = 0;
  giftMembershipRevenue = 0;
  newUsers = 0;
  giftVoucherUsers = 0;
  regularUsers = 0;
  totalLikes = 0;
  totalComments = 0;
  totalCandles = 0;
  averageInteractionsPerMemory = 0;
  reportedContentCount = 0;
  expiredTrialUsers = 0;
  expiredPackageUsers = 0;
  selectedRange: DashboardRange = '7d';
  startDate = '';
  endDate = '';
  loading = false;
  trend: DashboardTrendPoint[] = [];
  recentActivities: Array<{ icon: string; title: string; description: string; date: string; actor: string }> = [];
  private rawRecentActivities: DashboardRecentActivity[] = [];

  packageStats: DashboardPackageStat[] = [
    { name: 'Origin', userCount: 0, percentage: 0, icon: 'bi-stars', subtitleKey: 'ADMIN_DASHBOARD.PACKAGES.ORIGIN_DESC' },
    { name: 'Heart', userCount: 0, percentage: 0, icon: 'bi-heart', subtitleKey: 'ADMIN_DASHBOARD.PACKAGES.HEART_DESC' },
    { name: 'Family', userCount: 0, percentage: 0, icon: 'bi-people', subtitleKey: 'ADMIN_DASHBOARD.PACKAGES.FAMILY_DESC' },
  ];

  constructor(
    private dashboardService: DashboardService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.translate.onLangChange.subscribe(() => {
      this.recentActivities = this.rawRecentActivities.map(activity => this.mapRecentActivity(activity));
    });
    this.setRange('7d');
  }

  setRange(range: Exclude<DashboardRange, 'custom'>): void {
    this.selectedRange = range;
    const end = new Date();
    const start = new Date(end);
    if (range === '7d') start.setDate(end.getDate() - 6);
    if (range === '15d') start.setDate(end.getDate() - 14);
    if (range === '1m') start.setMonth(end.getMonth() - 1);
    if (range === '6m') start.setMonth(end.getMonth() - 6);
    this.startDate = this.toInputDate(start);
    this.endDate = this.toInputDate(end);
    this.loadDashboard();
  }

  applyCustomRange(): void {
    if (!this.startDate || !this.endDate || this.startDate > this.endDate) return;
    this.selectedRange = 'custom';
    this.loadDashboard();
  }


  get totalInteractions(): number {
    return this.totalLikes + this.totalComments + this.totalCandles;
  }

  get likeInteractionPercentage(): number {
    return this.totalInteractions ? Math.round((this.totalLikes / this.totalInteractions) * 100) : 0;
  }

  get commentInteractionPercentage(): number {
    return this.totalInteractions ? Math.round((this.totalComments / this.totalInteractions) * 100) : 0;
  }

  get candleInteractionPercentage(): number {
    return this.totalInteractions ? Math.max(0, 100 - this.likeInteractionPercentage - this.commentInteractionPercentage) : 0;
  }

  get interactionDonutBackground(): string {
    const likesEnd = this.likeInteractionPercentage;
    const commentsEnd = likesEnd + this.commentInteractionPercentage;
    return `conic-gradient(var(--st-green) 0 ${likesEnd}%, var(--st-green-mid) ${likesEnd}% ${commentsEnd}%, var(--st-sage) ${commentsEnd}% 100%)`;
  }

  get activeRate(): number {
    return this.totalUsers ? Math.round((this.activeMembers / this.totalUsers) * 100) : 0;
  }

  get activeRingBackground(): string {
    return `conic-gradient(var(--bs-primary) ${this.activeRate}%, #f3c0c5 0)`;
  }

  get averageRevenuePerUser(): number {
    return this.totalUsers ? this.totalRevenue / this.totalUsers : 0;
  }

  get membershipRevenuePercentage(): number {
    return this.periodRevenue ? Math.round((this.regularMembershipRevenue / this.periodRevenue) * 100) : 0;
  }

  get giftRevenuePercentage(): number {
    return this.periodRevenue ? Math.max(0, 100 - this.membershipRevenuePercentage) : 0;
  }

  get revenueDonutBackground(): string {
    return `conic-gradient(var(--st-green) ${this.membershipRevenuePercentage}%, var(--st-sage) 0)`;
  }

  get giftVoucherUserPercentage(): number {
    return this.totalUsers ? Math.round((this.giftVoucherUsers / this.totalUsers) * 100) : 0;
  }

  get regularUserPercentage(): number {
    return this.totalUsers ? Math.max(0, 100 - this.giftVoucherUserPercentage) : 0;
  }

  get registrationSourceDonutBackground(): string {
    return `conic-gradient(var(--bs-primary) 0 ${this.regularUserPercentage}%, var(--st-sage) ${this.regularUserPercentage}% 100%)`;
  }


  get registrationSourceDominantPercentage(): number {
    return Math.max(this.regularUserPercentage, this.giftVoucherUserPercentage);
  }

  get registrationSourceDominantLabelKey(): string {
    return this.regularUserPercentage >= this.giftVoucherUserPercentage
      ? 'ADMIN_DASHBOARD.REGISTRATION_SOURCE.REGULAR'
      : 'ADMIN_DASHBOARD.REGISTRATION_SOURCE.GIFT';
  }

  get activityUserCount(): number {
    return this.rawRecentActivities.filter(x => (x.type || '').toUpperCase() === 'USER').length;
  }

  get activityPaymentCount(): number {
    return this.rawRecentActivities.filter(x => (x.type || '').toUpperCase() === 'PAYMENT').length;
  }

  get activityGiftCount(): number {
    return this.rawRecentActivities.filter(x => (x.type || '').toUpperCase() === 'GIFT').length;
  }

  get activityMemoryCount(): number {
    return this.rawRecentActivities.filter(x => (x.type || '').toUpperCase() === 'MEMORY').length;
  }

  get trendMax(): number {
    return Math.max(1, ...this.trend.map(x => (x.membershipRevenue || 0) + (x.giftRevenue || 0)));
  }

  trendRevenueHeight(point: DashboardTrendPoint, type: 'membership' | 'gift'): number {
    const value = type === 'membership' ? (point.membershipRevenue || 0) : (point.giftRevenue || 0);
    if (value <= 0) return 0;
    return Math.max(4, (value / this.trendMax) * 100);
  }

  formatTrendDate(value: string): string {
    if (!value) return '';
    const calendarDate = value.substring(0, 10);
    const parts = calendarDate.split('-');
    return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : value;
  }

  private loadDashboard(): void {
    this.loading = true;
    this.dashboardService.getDashboard(this.startDate, this.endDate).subscribe({
      next: result => {
        this.loading = false;
        if (!result?.isSuccess || !result.data) {
          this.toastr.error(result?.message || this.translate.instant('ADMIN_DASHBOARD.LOAD_ERROR'), this.translate.instant('ERROR'));
          return;
        }
        const d = result.data;
        this.totalUsers = d.totalUsers || 0;
        this.activeMembers = d.activeMembers || 0;
        this.totalMemories = d.totalMemories || 0;
        this.periodMemories = d.periodMemories || 0;
        // Üst özet kartındaki gelir globaldir. Dönemsel gelir kartı ise yalnızca
        // seçili tarih aralığının trend verilerinden hesaplanır.
        this.totalRevenue = d.totalRevenue ?? ((d.membershipRevenue || 0) + (d.giftRevenue || 0));
        this.totalGiftPackages = d.totalGifts || 0;
        this.giftVoucherUsers = d.giftVoucherUsers || 0;
        this.regularUsers = d.regularUsers ?? Math.max(0, this.totalUsers - this.giftVoucherUsers);
        this.totalLikes = d.totalLikes || 0;
        this.totalComments = d.totalComments || 0;
        this.totalCandles = d.totalCandles || 0;
        this.averageInteractionsPerMemory = d.averageInteractionsPerMemory || 0;
        this.reportedContentCount = d.reportedContentCount || 0;
        this.expiredTrialUsers = d.expiredTrialUsers || 0;
        this.expiredPackageUsers = d.expiredPackageUsers || 0;
        this.trend = d.trend || [];
        this.regularMembershipRevenue = this.trend.reduce((sum, item) => sum + (item.membershipRevenue || 0), 0);
        this.giftMembershipRevenue = this.trend.reduce((sum, item) => sum + (item.giftRevenue || 0), 0);
        this.periodRevenue = this.regularMembershipRevenue + this.giftMembershipRevenue;
        this.newUsers = this.trend.reduce((sum, item) => sum + (item.newUsers || 0), 0);
        this.rawRecentActivities = d.recentActivities || [];
        this.recentActivities = this.rawRecentActivities.map(activity => this.mapRecentActivity(activity));
        const packageTotal = (d.originUsers || 0) + (d.heartUsers || 0) + (d.familyUsers || 0);
        this.packageStats = [
          { ...this.packageStats[0], userCount: d.originUsers || 0, percentage: packageTotal ? Math.round((d.originUsers || 0) * 100 / packageTotal) : 0 },
          { ...this.packageStats[1], userCount: d.heartUsers || 0, percentage: packageTotal ? Math.round((d.heartUsers || 0) * 100 / packageTotal) : 0 },
          { ...this.packageStats[2], userCount: d.familyUsers || 0, percentage: packageTotal ? Math.round((d.familyUsers || 0) * 100 / packageTotal) : 0 },
        ];
      },
      error: err => {
        this.loading = false;
        this.toastr.error(err?.error?.message || this.translate.instant('ADMIN_DASHBOARD.SERVICE_ERROR'), this.translate.instant('ERROR'));
      }
    });
  }

  private mapRecentActivity(activity: DashboardRecentActivity): { icon: string; title: string; description: string; date: string; actor: string } {
    const type = activity.type || '';
    const name = activity.name || '-';
    const actorName = activity.actorName || name;
    const amount = activity.amount ?? 0;
    const key = type.toUpperCase();
    const iconMap: Record<string, string> = {
      USER: 'bi-person-plus',
      PAYMENT: 'bi-credit-card',
      GIFT: 'bi-gift',
      MEMORY: 'bi-heart'
    };

    const title = this.translate.instant(`ADMIN_DASHBOARD.ACTIVITY.${key}_TITLE`);
    const description = this.translate.instant(`ADMIN_DASHBOARD.ACTIVITY.${key}_DESC`, { name, amount });
    const date = this.formatActivityDate(activity.date);
    const actor = actorName;

    return {
      icon: iconMap[key] || 'bi-activity',
      title,
      description,
      date,
      actor
    };
  }

  private formatActivityDate(value: string): string {
    if (!value) return '';

    // Backend tarihini takvim değeri olarak göster. Böylece UTC/local timezone
    // dönüşümü 00:00 kayıtlarını bir önceki güne kaydırmaz.
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (match) {
      return `${match[3]}.${match[2]}.${match[1]} ${match[4]}:${match[5]}`;
    }

    return value;
  }

  private toInputDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
