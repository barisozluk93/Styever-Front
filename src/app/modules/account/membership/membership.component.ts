import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { UserModel } from '../../user-management/models/user.model';
import { AuthService, UserType } from '../../auth';
import { UserManagementService } from '../../user-management/user-management.service';
import { TranslateService } from '@ngx-translate/core';
import { parseBoolean } from 'src/app/utils/parse-boolean';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(
    private auth: AuthService,
    private userManagementService: UserManagementService,
    private router: Router,
    @Inject(LOCALE_ID) public locale: string
  ) { }

  ngOnInit(): void {
    this.auth.currentUserSubject.subscribe(result => {
      this.user = result;
      this.isUserActive = parseBoolean(this.user?.isActive);

      this.userManagementService.updateUser(this.user?.id!);

      this.userManagementService.user$.subscribe(result => {
        this.userData = result!;

        if(this.userData) {
          this.userData.trialExpirationDate = formatDate(this.userData.trialExpirationDate!, "dd/MM/yyyy HH:mm", this.locale);
          this.userData.expirationDate = formatDate(this.userData.expirationDate!, "dd/MM/yyyy HH:mm", this.locale);
          this.userData.createdDate = formatDate(this.userData.createdDate!, "dd/MM/yyyy HH:mm", this.locale);
        }
      });
    });
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
