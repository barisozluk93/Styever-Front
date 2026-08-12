import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService, UserType } from '../auth';
import { UserManagementService } from '../user-management/user-management.service';
import { UserModel } from '../user-management/models/user.model';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { environment } from 'src/environments/environment';
import { scrollToTop } from 'src/app/utils/scrolltotop';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  @ViewChild('deleteAccountConfirmation')
  private deleteAccountConfirmation!: ConfirmationComponent;

  user: UserType;
  userData: UserModel;
  avatarUrl: string = '';

  constructor(
    private auth: AuthService,
    private userManagementService: UserManagementService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.auth.currentUserSubject.subscribe(result => {
      this.user = result;

      this.userManagementService.updateUser(this.user?.id!);

      this.userManagementService.user$.subscribe(result => {
        this.userData = result!;

        if (this.userData?.fileId) {
          this.avatarUrl = environment.avatarUploadFolderUrl + '/' +
            this.userData.file?.path.split('\\')[this.userData.file?.path.split('\\').length - 1];
        }
      });
    });
  }

  openDeleteAccountModal(): void {
    if (!this.userData?.id) {
      return;
    }

    const title = this.translate.currentLang === 'tr'
      ? 'Hesabı Sil'
      : 'Delete Account';

    this.deleteAccountConfirmation.openModal(title, this.userData.id);
  }

  deleteAccount(userId: number): void {
    if (!userId) {
      return;
    }

    this.http.delete<any>(`${environment.apiUrl}/User/Delete/${userId}`).subscribe({
      next: result => {
        if (result?.isSuccess === false) {
          scrollToTop();
          this.toastr.error(
            result?.message || this.translate.instant('ACCOUNT_DELETE_ERROR'),
            this.translate.instant('ERROR'),
            { positionClass: 'toast-top-center', timeOut: 3000 }
          );
          return;
        }

        scrollToTop();
        this.toastr.success(
          this.translate.instant('ACCOUNT_DELETED_SUCCESS'),
          this.translate.instant('SUCCESS'),
          { positionClass: 'toast-top-center', timeOut: 3000 }
        );

        this.auth.logout();
        this.router.navigate(['/auth/login']);
      },
      error: error => {
        scrollToTop();
        this.toastr.error(
          error?.error?.message || error?.message || this.translate.instant('ACCOUNT_DELETE_ERROR'),
          this.translate.instant('ERROR'),
          { positionClass: 'toast-top-center', timeOut: 3000 }
        );
      }
    });
  }
}
