import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Observable,
  Subscription,
  forkJoin
} from 'rxjs';

import { first } from 'rxjs/operators';

import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../services/auth.service';

import { ConfirmPasswordValidator } from './confirm-password.validator';

import { UserModelAuth } from '../../models/user.model';

import {
  UserAddressModel
} from 'src/app/modules/user-management/models/user-address.model';

import {
  UserModel
} from 'src/app/modules/user-management/models/user.model';

import {
  UserManagementService
} from 'src/app/modules/user-management/user-management.service';

import {
  ModalComponent
} from 'src/app/_metronic/partials/layout/modals/modal/modal.component';

import {
  ModalConfig
} from 'src/app/_metronic/partials/layout/modals/modal.config';
import { scrollToTop } from 'src/app/utils/scrolltotop';
import { PlanManagementService, PlanModel } from 'src/app/modules/common/plans/plan-management.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent
  implements OnInit, OnDestroy {

  /* =======================================================
     MODALS
     ======================================================= */

  @ViewChild('termsPrivacyModal')
  private termsPrivacyModalComponent!: ModalComponent;

  @ViewChild('kvkkModal')
  private kvkkModalComponent!: ModalComponent;


  /* =======================================================
     FORMS
     ======================================================= */

  paymentForm!: FormGroup;

  registrationForm!: FormGroup;

  addressForm!: FormGroup;


  /* =======================================================
     UI STATE
     ======================================================= */

  hasError = false;

  isLoading$: Observable<boolean>;

  activeState:
    | 'paymentPlan'
    | 'membershipInfo'
    | 'addressInfo' = 'paymentPlan';

  activeVoucherPlan = -1;

  activePlan = 2;

  totalPrice = 0;

  useVoucher = false;

  voucher = '';

  private plans: PlanModel[] = [];


  /* =======================================================
     MODALS
     ======================================================= */

  termsPrivacyModalConfig!: ModalConfig;

  kvkkModalConfig!: ModalConfig;


  /* =======================================================
     SUBSCRIPTIONS
     ======================================================= */

  private unsubscribe: Subscription[] = [];


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserManagementService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private planManagementService: PlanManagementService
  ) {

    this.isLoading$ =
      this.authService.isLoading$;


    /*
     * Login olmuş kullanıcı tekrar
     * registration ekranına girmesin.
     */

    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

  }


  /* =======================================================
     INIT
     ======================================================= */

  ngOnInit(): void {
    this.initForm();
    this.loadPlans();
  }

  private loadPlans(): void {
    this.planManagementService.getAll().subscribe({
      next: result => {
        this.plans = result?.isSuccess && result.data ? result.data.filter(x => !x.isDeleted) : [];
        this.setPlanPrice(this.activePlan);
      },
      error: () => {
        this.plans = [];
        this.totalPrice = 0;
      }
    });
  }

  private setPlanPrice(planId: number): void {
    const plan = this.plans.find(x => Number(x.id) === Number(planId));
    this.totalPrice = plan ? Number(plan.price || 0) : 0;
  }


  /* =======================================================
     LOGIN
     ======================================================= */

  goToLogin(): void {

    this.router.navigate([
      '/auth/login'
    ]);

  }


  /* =======================================================
     CHANGE STATE
     ======================================================= */

  changeState(
    state:
      | 'paymentPlan'
      | 'membershipInfo'
      | 'addressInfo'
  ): void {

    this.hasError = false;


    /* -------------------------------------------------------
       PLAN -> MEMBERSHIP
       Plan yoksa devam etme.
       ------------------------------------------------------- */

    if (
      this.activeState === 'paymentPlan' &&
      state === 'membershipInfo' &&
      this.activePlan < 2
    ) {

      return;

    }


    /* -------------------------------------------------------
       MEMBERSHIP -> ADDRESS
       Form invalid ise validationları göster.
       ------------------------------------------------------- */

    if (
      this.activeState === 'membershipInfo' &&
      state === 'addressInfo' &&
      this.registrationForm.invalid
    ) {

      this.registrationForm
        .markAllAsTouched();

      return;

    }


    this.activeState = state;


    /*
     * Ekran değiştiğinde yukarı dön.
     */

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  /* =======================================================
     PLAN SELECT
     ======================================================= */

  isPlanSelect(plan: number): void {
    this.activePlan = plan;
    this.setPlanPrice(plan);
  }


  /* =======================================================
     REGISTRATION CONTROLS
     ======================================================= */

  get f() {
    return this.registrationForm.controls;
  }


  /* =======================================================
     INIT FORMS
     ======================================================= */

  initForm(): void {

    /* -------------------------------------------------------
       ADDRESS
       ------------------------------------------------------- */

    this.addressForm = this.fb.group({

      id: [0],

      country: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],

      city: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],

      district: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],

      address: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],

      addressHeader: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],

      isDeleted: [false]

    });


    /* -------------------------------------------------------
       REGISTRATION
       ------------------------------------------------------- */

    this.registrationForm = this.fb.group(
      {

        name: [
          '',
          Validators.compose([
            Validators.required
          ])
        ],

        surname: [
          '',
          Validators.compose([
            Validators.required
          ])
        ],

        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email
          ])
        ],

        password: [
          '',
          Validators.compose([
            Validators.required
          ])
        ],

        cPassword: [
          '',
          Validators.compose([
            Validators.required
          ])
        ],

        phone: [
          '',
          Validators.compose([
            Validators.required
          ])
        ],


        /* -----------------------------------------------
           AGREEMENTS
           ----------------------------------------------- */

        termsAndPrivacyAccepted: [
          false,
          Validators.requiredTrue
        ],

        kvkkAccepted: [
          false,
          Validators.requiredTrue
        ],

        commercialPermission: [
          false
        ],

        /*
         * Backend modelinde hâlâ mevcut.
         * UI'da göstermiyorsan false olarak kalır.
         */

        socialResponsibilityConsent: [
          false
        ]

      },
      {
        validator:
          ConfirmPasswordValidator.MatchPassword
      }
    );


    /* -------------------------------------------------------
       PAYMENT
       Mevcut akış için korunuyor.
       ------------------------------------------------------- */

    this.paymentForm = this.fb.group({

      fullname: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])
      ],

      cardno: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16)
        ])
      ],

      expiryDate: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4)
        ])
      ],

      cvv: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(3)
        ])
      ]

    });

  }


  /* =======================================================
     TERMS + PRIVACY MODAL
     ======================================================= */

  openTermsPrivacyModal(): void {

    const keys = [
      'LEGAL_TERMS_PRIVACY_TITLE',
      'OK',
      'CANCEL'
    ];


    const observables =
      keys.map(
        key =>
          this.translate.get(key)
      );


    forkJoin(observables)
      .subscribe(results => {

        const translations: any = {};


        keys.forEach(
          (key, index) => {

            translations[key] =
              results[index];

          }
        );


        this.termsPrivacyModalConfig = {

          modalTitle:
            translations[
              'LEGAL_TERMS_PRIVACY_TITLE'
            ],

          dismissButtonLabel:
            translations['OK'],

          closeButtonLabel:
            translations['CANCEL'],

          onDismiss:
            this.acceptTermsPrivacy.bind(this)

        };


        this.termsPrivacyModalComponent
          .open({
            size: 'lg',
            backdrop: 'static'
          });

      });

  }


  /* =======================================================
     ACCEPT TERMS + PRIVACY
     ======================================================= */

  acceptTermsPrivacy(): boolean {

    const control =
      this.registrationForm.get(
        'termsAndPrivacyAccepted'
      );


    control?.setValue(true);

    control?.markAsTouched();

    control?.updateValueAndValidity();


    return true;

  }


  /* =======================================================
     KVKK MODAL
     ======================================================= */

  openKvkkModal(): void {

    const keys = [
      'KVKK_MODAL_TITLE',
      'OK',
      'CANCEL'
    ];


    const observables =
      keys.map(
        key =>
          this.translate.get(key)
      );


    forkJoin(observables)
      .subscribe(results => {

        const translations: any = {};


        keys.forEach(
          (key, index) => {

            translations[key] =
              results[index];

          }
        );


        this.kvkkModalConfig = {

          modalTitle:
            translations[
              'KVKK_MODAL_TITLE'
            ],

          dismissButtonLabel:
            translations['OK'],

          closeButtonLabel:
            translations['CANCEL'],

          onDismiss:
            this.acceptKvkk.bind(this)

        };


        this.kvkkModalComponent
          .open({
            size: 'lg',
            backdrop: 'static'
          });

      });

  }


  /* =======================================================
     ACCEPT KVKK
     ======================================================= */

  acceptKvkk(): boolean {

    const control =
      this.registrationForm.get(
        'kvkkAccepted'
      );


    control?.setValue(true);

    control?.markAsTouched();

    control?.updateValueAndValidity();


    return true;

  }


  /* =======================================================
     AGREEMENT VERSION
     CURRENT YYYY.MM
     ======================================================= */

  private getAgreementVersion(): string {

    const now = new Date();

    const year =
      now.getFullYear();

    const month =
      String(
        now.getMonth() + 1
      ).padStart(2, '0');


    return `${year}.${month}`;

  }


  /* =======================================================
     SUBMIT
     ======================================================= */

  submit(): void {

    this.hasError = false;


    /* -------------------------------------------------------
       VALIDATION
       ------------------------------------------------------- */

    if (
      this.registrationForm.invalid ||
      this.addressForm.invalid
    ) {

      this.registrationForm
        .markAllAsTouched();

      this.addressForm
        .markAllAsTouched();

      return;

    }


    /* -------------------------------------------------------
       CREATE MODEL
       ------------------------------------------------------- */

    const newUser =
      this.registrationForm
        .getRawValue() as UserModel;


    newUser.roles = [
      this.activePlan
    ];


    newUser.username =
      newUser.email;


    newUser.userAddress =
      this.addressForm
        .getRawValue() as UserAddressModel;


    /* -------------------------------------------------------
       AGREEMENT METADATA
       ------------------------------------------------------- */

    const language =
      this.translate.currentLang || 'tr';


    /*
     * Artık hard-coded değil.
     * Örn:
     * 2026.08
     * 2027.01
     */

    const agreementVersion =
      this.getAgreementVersion();


    (newUser as any).agreementAcceptances = [

      /* ---------------------------------------------------
         MEMBERSHIP TERMS
         --------------------------------------------------- */

      {
        userId: 0,

        agreementType:
          'MembershipTerms',

        title:
          this.translate.instant(
            'FOOTER.TERMS_OF_USE'
          ),

        version:
          agreementVersion,

        language,

        context:
          'Registration',

        documentUrl:
          '/terms-of-use'
      },


      /* ---------------------------------------------------
         PRIVACY
         --------------------------------------------------- */

      {
        userId: 0,

        agreementType:
          'PrivacyPolicy',

        title:
          this.translate.instant(
            'FOOTER.PRIVACY_POLICY'
          ),

        version:
          agreementVersion,

        language,

        context:
          'Registration',

        documentUrl:
          '/privacy-policy'
      },


      /* ---------------------------------------------------
         KVKK
         --------------------------------------------------- */

      {
        userId: 0,

        agreementType:
          'KvkkDisclosure',

        title:
          this.translate.instant(
            'FOOTER.KVKK'
          ),

        version:
          agreementVersion,

        language,

        context:
          'Registration',

        documentUrl:
          '/kvkk'
      },


      /* ---------------------------------------------------
         COMMERCIAL COMMUNICATION
         Sadece kullanıcı kabul ettiyse.
         --------------------------------------------------- */

      ...(
        this.registrationForm
          .get('commercialPermission')
          ?.value

          ? [
              {
                userId: 0,

                agreementType:
                  'CommercialCommunication',

                title:
                  this.translate.instant(
                    'LEGAL_CHECKBOXES.COMMERCIAL_MESSAGE_PERMISSION'
                  ),

                version:
                  agreementVersion,

                language,

                context:
                  'Registration'
              }
            ]

          : []
      ),


      /* ---------------------------------------------------
         SOCIAL RESPONSIBILITY
         Backend compatibility için korunuyor.
         --------------------------------------------------- */

      ...(
        this.registrationForm
          .get('socialResponsibilityConsent')
          ?.value

          ? [
              {
                userId: 0,

                agreementType:
                  'SocialResponsibility',

                title:
                  this.translate.instant(
                    'LEGAL_CHECKBOXES.SOCIAL_RESPONSIBILITY'
                  ),

                version:
                  agreementVersion,

                language,

                context:
                  'Registration'
              }
            ]

          : []
      )

    ];


    /* -------------------------------------------------------
       VOUCHER
       ------------------------------------------------------- */

    if (this.useVoucher) {

      newUser.voucher =
        this.voucher.trim();

    }


    /* -------------------------------------------------------
       REGISTER
       ------------------------------------------------------- */

    const registrationSubscr =
      this.authService
        .registration(newUser)
        .pipe(first())
        .subscribe({

          next: (
            user: UserModelAuth
          ) => {

            if (user) {

              this.toastr.success(
                this.translate.instant('REGISTRATION_SUCCESS_MESSAGE'),
                this.translate.instant('SUCCESS'),
                {
                  positionClass: 'toast-top-center',
                  timeOut: 3000
                }
              );

              this.router.navigate([
                '/auth/login'
              ]);

            } else {

              this.hasError = true;

            }

          },

          error: (error) => {

            this.hasError = true;
            scrollToTop();
            this.toastr.error(
              error?.error?.message || error?.message || this.translate.instant('REGISTRATION_ERROR_MESSAGE'),
              this.translate.instant('ERROR'),
              { positionClass: 'toast-top-center', timeOut: 3000 }
            );

          }

        });


    this.unsubscribe.push(
      registrationSubscr
    );

  }


  /* =======================================================
     USE VOUCHER
     ======================================================= */

  onCheckboxChange(
    event: Event
  ): void {

    const checked =
      (
        event.target as HTMLInputElement
      ).checked;


    this.useVoucher =
      checked;


    this.hasError =
      false;


    if (this.useVoucher) {

      /*
       * Voucher modu:
       * Plan listesi HTML'de gizlenecek.
       * Geçerli voucher sonucuna göre plan atanacak.
       */

      this.activePlan = -1;

    } else {

      /*
       * Voucher kapatılırsa
       * Origin/default plana dön.
       */

      this.activePlan = 2;

      this.setPlanPrice(this.activePlan);

      this.voucher = '';

    }

  }


  /* =======================================================
     VOUCHER SEARCH
     ======================================================= */

  onVoucherSearch(): void {

    this.hasError = false;


    const voucherCode =
      this.voucher?.trim();


    /* -------------------------------------------------------
       EMPTY VOUCHER
       ------------------------------------------------------- */

    if (!voucherCode) {

      this.activePlan = -1;

      this.hasError = true;

      return;

    }


    /* -------------------------------------------------------
       CONTROL
       ------------------------------------------------------- */

    this.userService
      .voucherControl(voucherCode)
      .subscribe({

        next: result => {

          if (
            result.isSuccess &&
            result.data
          ) {

            /*
             * Voucher valid.
             */

            this.activePlan =
              result.data.planId;


            this.activeVoucherPlan =
              result.data.planId;


            this.totalPrice =
              result.data.price;


            this.voucher =
              voucherCode;


            /*
             * Otomatik Create Account ekranına geç.
             */

            this.changeState(
              'membershipInfo'
            );

          } else {

            this.activePlan = -1;

            this.activeVoucherPlan = -1;

            this.hasError = true;

          }

        },


        error: () => {

          this.activePlan = -1;

          this.activeVoucherPlan = -1;

          this.hasError = true;

        }

      });

  }


  /* =======================================================
     DESTROY
     ======================================================= */

  ngOnDestroy(): void {

    this.unsubscribe
      .forEach(subscription => {

        subscription.unsubscribe();

      });

  }

}