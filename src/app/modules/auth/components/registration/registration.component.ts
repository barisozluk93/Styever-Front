import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { first } from 'rxjs/operators';
import { UserModelAuth } from '../../models/user.model';
import { UserAddressModel } from 'src/app/modules/user-management/models/user-address.model';
import { UserModel } from 'src/app/modules/user-management/models/user.model';
import { UserManagementService } from 'src/app/modules/user-management/user-management.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent } from 'src/app/_metronic/partials/layout/modals/modal/modal.component';
import { ModalConfig } from 'src/app/_metronic/partials/layout/modals/modal.config';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @ViewChild('termsPrivacyModal') private termsPrivacyModalComponent: ModalComponent;
  @ViewChild('kvkkModal') private kvkkModalComponent: ModalComponent;

  paymentForm: FormGroup;
  registrationForm: FormGroup;
  addressForm: FormGroup;

  hasError: boolean;
  isLoading$: Observable<boolean>;

  activeState: string = 'paymentPlan';
  activeVoucherPlan: number = -1;
  activePlan: number = 2;
  totalPrice: number = 499.00;
  useVoucher: boolean;
  voucher: string = '';

  termsPrivacyModalConfig: ModalConfig;
  kvkkModalConfig: ModalConfig;

  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserManagementService,
    private translate: TranslateService,
  ) {
    this.isLoading$ = this.authService.isLoading$;

    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  changeState(state: string) {
    if (this.activeState === 'membershipInfo' && state === 'addressInfo' && this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.activeState = state;
  }

  isPlanSelect(plan: number) {
    this.activePlan = plan;

    if (this.activePlan == 2) {
      this.totalPrice = 499.00;
    } else if (this.activePlan == 3) {
      this.totalPrice = 699.00;
    } else if (this.activePlan == 4) {
      this.totalPrice = 1299.00;
    }
  }

  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.addressForm = this.fb.group({
      id: 0,
      country: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      addressHeader: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      district: [undefined, Validators.compose([Validators.required])],
      isDeleted: false
    });

    this.registrationForm = this.fb.group(
      {
        phone: ['', Validators.compose([Validators.required])],
        name: ['', Validators.compose([Validators.required])],
        surname: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.required])],
        cPassword: ['', Validators.compose([Validators.required])],

        termsAndPrivacyAccepted: [false, Validators.requiredTrue],
        kvkkAccepted: [false, Validators.requiredTrue],
        commercialPermission: [false],
        socialResponsibilityConsent: [false],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );

    this.paymentForm = this.fb.group({
      fullname: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      cardno: ['', Validators.compose([Validators.required, Validators.minLength(16), Validators.maxLength(16)])],
      expiryDate: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])],
      cvv: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3)])],
    });
  }

  openTermsPrivacyModal() {
    const keys = ['LEGAL_TERMS_PRIVACY_TITLE', 'OK', 'CANCEL'];
    const observables = keys.map(key => this.translate.get(key));

    forkJoin(observables).subscribe(results => {
      const translations: any = {};

      keys.forEach((key, index) => {
        translations[key] = results[index];
      });

      this.termsPrivacyModalConfig = {
        modalTitle: translations['LEGAL_TERMS_PRIVACY_TITLE'],
        dismissButtonLabel: translations['OK'],
        closeButtonLabel: translations['CANCEL'],
        onDismiss: this.acceptTermsPrivacy.bind(this),
      };

      this.termsPrivacyModalComponent.open({ size: 'lg', backdrop: 'static' });
    });
  }

  acceptTermsPrivacy() {
    this.registrationForm.get('termsAndPrivacyAccepted')?.setValue(true);
    this.registrationForm.get('termsAndPrivacyAccepted')?.markAsTouched();
    this.registrationForm.get('termsAndPrivacyAccepted')?.updateValueAndValidity();

    return true;
  }

  openKvkkModal() {
    const keys = ['KVKK_MODAL_TITLE', 'OK', 'CANCEL'];
    const observables = keys.map(key => this.translate.get(key));

    forkJoin(observables).subscribe(results => {
      const translations: any = {};

      keys.forEach((key, index) => {
        translations[key] = results[index];
      });

      this.kvkkModalConfig = {
        modalTitle: translations['KVKK_MODAL_TITLE'],
        dismissButtonLabel: translations['OK'],
        closeButtonLabel: translations['CANCEL'],
        onDismiss: this.acceptKvkk.bind(this),
      };

      this.kvkkModalComponent.open({ size: 'lg', backdrop: 'static' });
    });
  }

  acceptKvkk() {
    this.registrationForm.get('kvkkAccepted')?.setValue(true);
    this.registrationForm.get('kvkkAccepted')?.markAsTouched();
    this.registrationForm.get('kvkkAccepted')?.updateValueAndValidity();

    return true;
  }

  submit() {
    this.hasError = false;

    if (this.registrationForm.invalid || this.addressForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.addressForm.markAllAsTouched();
      return;
    }

    const newUser = this.registrationForm.getRawValue() as UserModel;

    newUser.roles = [this.activePlan];
    newUser.username = newUser.email;
    newUser.userAddress = this.addressForm.getRawValue() as UserAddressModel;
    const language=this.translate.currentLang||'tr';
    (newUser as any).agreementAcceptances=[
      {userId:0,agreementType:'MembershipTerms',title:this.translate.instant('TERMS.PAGE_TITLE'),version:'2026.08',language,context:'Registration',documentUrl:'/terms-of-use'},
      {userId:0,agreementType:'PrivacyPolicy',title:this.translate.instant('PRIVACY_POLICY.PAGE_TITLE'),version:'2026.08',language,context:'Registration',documentUrl:'/privacy-policy'},
      {userId:0,agreementType:'KvkkDisclosure',title:this.translate.instant('KVKK.PAGE_TITLE'),version:'2026.08',language,context:'Registration',documentUrl:'/kvkk'},
      ...(this.registrationForm.get('commercialPermission')?.value?[{userId:0,agreementType:'CommercialCommunication',title:this.translate.instant('LEGAL_CHECKBOXES.COMMERCIAL_MESSAGE_PERMISSION'),version:'2026.08',language,context:'Registration'}]:[]),
      ...(this.registrationForm.get('socialResponsibilityConsent')?.value?[{userId:0,agreementType:'SocialResponsibility',title:this.translate.instant('LEGAL_CHECKBOXES.SOCIAL_RESPONSIBILITY'),version:'2026.08',language,context:'Registration'}]:[])
    ];

    if (this.useVoucher) {
      newUser.voucher = this.voucher;
    }

    const registrationSubscr = this.authService
      .registration(newUser)
      .pipe(first())
      .subscribe((user: UserModelAuth) => {
        if (user) {
          this.router.navigate(['/auth/login']);
        } else {
          this.hasError = true;
        }
      });

    this.unsubscribe.push(registrationSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  onCheckboxChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.useVoucher = checked;

    if (this.useVoucher) {
      this.activePlan = -1;
    } else {
      this.activePlan = 2;
    }
  }

  onVoucherSearch() {
    this.userService.voucherControl(this.voucher).subscribe(result => {
      if (result.isSuccess) {
        if (result.data) {
          this.activePlan = result.data.planId;
          this.totalPrice = result.data.price;
        } else {
          this.activePlan = -1;
          this.hasError = true;
        }
      } else {
        this.activePlan = -1;
        this.hasError = true;
      }
    });
  }
}