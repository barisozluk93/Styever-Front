import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { ResultModel } from 'src/app/models/result.model';
import { AuthService, ConfirmPasswordValidator, UserType } from 'src/app/modules/auth';
import { UserModel } from 'src/app/modules/user-management/models/user.model';
import { UserManagementService } from 'src/app/modules/user-management/user-management.service';
import { parseBoolean } from 'src/app/utils/parse-boolean';
import { scrollToTop } from 'src/app/utils/scrolltotop';

@Component({
  selector: 'app-sign-in-method',
  templateUrl: './sign-in-method.component.html',
  styleUrls: ['./sign-in-method.component.scss'],
})
export class SignInMethodComponent implements OnInit, OnDestroy, OnChanges {
  showChangeEmailForm: boolean = false;
  showChangePasswordForm: boolean = false;
  changePasswordForm: FormGroup;
  changeEmailForm: FormGroup;

  @Input() user: UserModel;
  isUserActive: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userManagementService: UserManagementService,
    private toastr: ToastrService,
    private translateService: TranslateService) {
  }

  setForm() {
    if (this.user) {
      this.changeEmailForm.patchValue(this.user);

      this.changeEmailForm.get("password")?.setValue("***");
      this.changeEmailForm.get("cPassword")?.setValue("***");
      this.changeEmailForm.get("roles")?.setValue(this.user.roles[0])
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user) {
      if (!this.changeEmailForm) {
        this.initChangeEmailForm();
      }

      if (!this.changePasswordForm) {
        this.initChangePasswordForm();
      }
      this.setForm();
    }
  }

  ngOnInit(): void {
    this.initChangeEmailForm();
    this.initChangePasswordForm();
    this.changePasswordForm.get("id")?.setValue(this.user?.id);

    this.isUserActive = parseBoolean(this.authService.currentUserValue?.isActive);
  }

  toggleEmailForm(show: boolean) {
    this.changePasswordForm.reset({ id: this.user?.id, newEmail: "" });
    this.showChangeEmailForm = show;
  }

  saveEmail() {
    if (this.changeEmailForm.valid) {
      var temp = this.changeEmailForm.getRawValue();
      var data = this.changeEmailForm.getRawValue() as UserModel;

      if (temp.roles || temp.roles > 0) {
        data.roles = [temp.roles];
      }
      else {
        data.roles = [];
      }

      this.userManagementService.userProfileEdit(data).subscribe(result => {
        if (result.isSuccess) {
          scrollToTop();

          this.toastr.success(this.translateService.instant('SUCCESS_MESSAGE'), this.translateService.instant('SUCCESS'), {
            positionClass: 'toast-top-center',
            timeOut: 3000
          });

          setTimeout(() => {
            this.authService.logout();
            document.location.reload();
          }, 3000);
        }
        else {
          scrollToTop();
          this.toastr.error(result.message, this.translateService.instant('ERROR'), {
            positionClass: 'toast-top-center',
            timeOut: 3000
          });
        }
      })
    }
  }

  togglePasswordForm(show: boolean) {
    this.changePasswordForm.reset({ id: this.user?.id, currentPassword: "", password: "", cPassword: "" });
    this.showChangePasswordForm = show;
  }

  savePassword() {
    if (this.changePasswordForm.valid) {
      let data = this.changePasswordForm.getRawValue();

      this.authService
        .changePassword(data.id, data.currentPassword, data.password)
        .pipe(first())
        .subscribe((result: ResultModel<boolean>) => {

          if (result.isSuccess) {
            scrollToTop();

            this.toastr.success(this.translateService.instant('SUCCESS_MESSAGE'), this.translateService.instant('SUCCESS'), {
              positionClass: 'toast-top-center',
              timeOut: 3000
            });

            setTimeout(() => {
              this.authService.logout();
              document.location.reload();
            }, 3000);
          }
          else {
            scrollToTop();

            this.toastr.error(result.message, this.translateService.instant('ERROR'), {
              positionClass: 'toast-top-center',
              timeOut: 3000
            });
          }
        });
    }
  }

  ngOnDestroy() {
  }

  initChangeEmailForm() {
    this.changeEmailForm = this.fb.group({
      id: 0,
      name: [
        "",
        Validators.compose([
          Validators.required,
        ]),
      ],
      surname: [
        "",
        Validators.compose([
          Validators.required,
        ]),
      ],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
      phone: [
        "",
        Validators.compose([
          Validators.required,
        ]),
      ],
      country: [
        "",
        // Validators.compose([
        //   Validators.required,
        // ]),
      ],
      city: [
        "",
        // Validators.compose([
        //   Validators.required,
        // ]),
      ],
      district: [
        "",
        // Validators.compose([
        //   Validators.required,
        // ]),
      ],
      address: [
        "",
        // Validators.compose([
        //   Validators.required,
        // ]),
      ],
      roles: [
        null
      ],
      username: [
        "",
        Validators.compose([
          Validators.required,
        ]),
      ],
      password: [
        '',
      ],
      fileId: [
        '',
      ],
    });
  }

  initChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      id: 0,
      currentPassword: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      cPassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      });
  }
}
