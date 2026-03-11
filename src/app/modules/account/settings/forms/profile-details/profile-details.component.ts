import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService, UserType } from 'src/app/modules/auth';
import { UserModel } from 'src/app/modules/user-management/models/user.model';
import { UserManagementService } from 'src/app/modules/user-management/user-management.service';
import { parseBoolean } from 'src/app/utils/parse-boolean';
import { scrollToTop } from 'src/app/utils/scrolltotop';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent implements OnInit, OnDestroy, OnChanges {
  private unsubscribe: Subscription[] = [];
  form: FormGroup;
  isUserActive: boolean;
  avatarUrl: string = '';
  @Input() user: UserModel;
  constructor(private fb: FormBuilder, private userManagementService: UserManagementService,
    private toastr: ToastrService, private authService: AuthService,
    private translateService: TranslateService
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user) {
      this.user = changes.user.currentValue;

      if (!this.form) {
        this.initForm();
      }

      this.setUserForm();

      if (this.user?.fileId) {
        this.avatarUrl = environment.avatarUploadFolderUrl + "/" + this.user.file?.path.split("\\")[this.user.file?.path.split("\\").length - 1];
      }
    }
  }

  initForm() {
    this.form = this.fb.group({
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

  setUserForm() {

    if (this.user) {
      this.form.patchValue(this.user);

      this.form.get("password")?.setValue("***");
      this.form.get("cPassword")?.setValue("***");
      this.form.get("roles")?.setValue(this.user.roles[0])
    }
  }

  ngOnInit(): void {
    this.initForm();

    this.isUserActive = parseBoolean(this.authService.currentUserValue?.isActive);
  }

  saveSettings() {
    if (this.form.valid) {
      var temp = this.form.getRawValue();
      var data = this.form.getRawValue() as UserModel;

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
          this.userManagementService.updateUser(data.id);
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  onFileChange(event: any) {

    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      var src = URL.createObjectURL(file);
      var img = new Image;
      img.src = src;

      let width = 0;
      let height = 0;

      img.onload = () => {
        width = img.naturalWidth;
        height = img.naturalHeight;

        if (width == 300 && height == 300) {
          let formData = new FormData();
          formData.append("file", file);
          formData.append("type", "1");

          this.userManagementService.upload(formData).subscribe(result => {
            if (result.isSuccess) {
              this.userManagementService.userAvatarEdit(this.user.id, result.data.id).subscribe(result => {
                if (result.isSuccess) {
                  scrollToTop();

                  this.toastr.success(this.translateService.instant('SUCCESS_MESSAGE'), this.translateService.instant('SUCCESS'), {
                    positionClass: 'toast-top-center',
                    timeOut: 3000
                  }); this.userManagementService.updateUser(this.user.id);
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
            else {
              scrollToTop();

              this.toastr.error(result.message, this.translateService.instant('ERROR'), {
                positionClass: 'toast-top-center',
                timeOut: 3000
              });
            }
          })
        }
        else {
          scrollToTop();

          this.toastr.warning(this.translateService.instant('PLEASE_UPLOAD_IMAGE_SIZE_300X300'), this.translateService.instant('WARNING'), {
            positionClass: 'toast-top-center',
            timeOut: 3000
          });
          
        }
      };
    }
  }

}
