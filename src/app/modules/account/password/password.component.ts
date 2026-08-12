import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { ResultModel } from 'src/app/models/result.model';
import { AuthService, ConfirmPasswordValidator } from 'src/app/modules/auth';
import { parseBoolean } from 'src/app/utils/parse-boolean';
import { scrollToTop } from 'src/app/utils/scrolltotop';

@Component({
  selector: 'app-account-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class AccountPasswordComponent implements OnInit {
  form: FormGroup;
  isUserActive = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.isUserActive = parseBoolean(this.authService.currentUserValue?.isActive);
    this.form = this.fb.group({
      id: [this.authService.currentUserValue?.id || 0],
      currentPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      cPassword: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    }, { validator: ConfirmPasswordValidator.MatchPassword });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.getRawValue();
    this.authService.changePassword(data.id, data.currentPassword, data.password).pipe(first()).subscribe((result: ResultModel<boolean>) => {
      if (result.isSuccess) {
        scrollToTop();
        this.toastr.success(this.translate.instant('PASSWORD_UPDATED_SUCCESS'), this.translate.instant('SUCCESS'), { positionClass: 'toast-top-center', timeOut: 3000 });
        this.form.reset({ id: data.id, currentPassword: '', password: '', cPassword: '' });
      } else {
        scrollToTop();
        this.toastr.error(result.message, this.translate.instant('ERROR'), { positionClass: 'toast-top-center', timeOut: 3000 });
      }
    });
  }
}
