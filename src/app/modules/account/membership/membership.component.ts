import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { UserModel } from '../../user-management/models/user.model';
import { AuthService, UserType } from '../../auth';
import { UserManagementService } from '../../user-management/user-management.service';
import { TranslateService } from '@ngx-translate/core';
import { parseBoolean } from 'src/app/utils/parse-boolean';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { PlanManagementService, PlanModel } from '../../common/plans/plan-management.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss'],

})
export class MembershipComponent implements OnInit {
  user: UserType;
  userData: UserModel;

  isUserActive: boolean;
  showPlans: boolean = false;
  trialExpirationDate: string;
  expirationDate: string;
  createdDate: string;
  currentPlan?: PlanModel;
  currentPlanProperties: string[] = [];

  constructor(
    private auth: AuthService,
    private userManagementService: UserManagementService,
    private router: Router,
    private planManagementService: PlanManagementService,
    private translate: TranslateService,
    @Inject(LOCALE_ID) public locale: string
  ) { }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => this.mapCurrentPlanProperties());
    this.auth.currentUserSubject.subscribe(result => {
      this.user = result;
      this.isUserActive = parseBoolean(this.user?.isActive);

      this.userManagementService.updateUser(this.user?.id!);

      this.userManagementService.user$.subscribe(result => {
        this.userData = result!;

        if(this.userData) {
          this.trialExpirationDate = formatDate(this.userData.trialExpirationDate!, "dd/MM/yyyy HH:mm", this.locale);
          this.expirationDate = formatDate(this.userData.expirationDate!, "dd/MM/yyyy HH:mm", this.locale);
          this.createdDate = formatDate(this.userData.createdDate!, "dd/MM/yyyy HH:mm", this.locale);
          this.loadCurrentPlan();
        }
      });
    });
  }

  private loadCurrentPlan(): void {
    // Package roles and Plan ids are aligned: 2=Origin, 3=Heart, 4=Family.
    // Membership card content comes from the Plan table; user data is used only
    // for membership dates/status shown at the bottom of the card.
    const packageRoleId = (this.userData?.roles || [])
      .map(role => Number(role))
      .find(role => role >= 2 && role <= 4);

    if (!packageRoleId) {
      this.currentPlan = undefined;
      this.currentPlanProperties = [];
      return;
    }

    this.planManagementService.get(packageRoleId).subscribe(result => {
      if (result?.isSuccess && result.data) {
        this.currentPlan = result.data;
        this.mapCurrentPlanProperties();
      }
    });
  }

  private mapCurrentPlanProperties(): void {
    if (!this.currentPlan) {
      this.currentPlanProperties = [];
      return;
    }
    const isTr = this.translate.currentLang === 'tr' || this.translate.instant('LANG') === 'tr';
    const value = isTr ? this.currentPlan.properties : this.currentPlan.propertiesEn;
    this.currentPlanProperties = (value || '').split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  }

  get currentPlanName(): string {
    if (!this.currentPlan) return '';
    const isTr = this.translate.currentLang === 'tr' || this.translate.instant('LANG') === 'tr';
    return isTr ? this.currentPlan.name : this.currentPlan.nameEn;
  }

  get currentPlanPrice(): string {
    if (!this.currentPlan) return '';
    const isTr = this.translate.currentLang === 'tr' || this.translate.instant('LANG') === 'tr';
    const price = Number(this.currentPlan.price || 0).toLocaleString(isTr ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const period = isTr ? this.currentPlan.period : this.currentPlan.periodEn;
    return `${this.currentPlan.currency || '₺'}${price}/${period}`;
  }

  pay() {
    this.router.navigate(["/payment"], {
      queryParams: {
        typeId: 1,
        role: this.userData.roles[0],
      }
    });
  }

  buyNewPackage() { 
    this.showPlans = !this.showPlans;
  }
}
