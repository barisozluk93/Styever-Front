import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserManagementService } from '../user-management/user-management.service';
import { AuthService, UserType } from '../auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { GiftModel } from '../gift/models/gift.model';
import { GiftManagementService } from '../gift/gift-management.service';
import { MemoryManagementService } from '../memory/memory-management.service';
import { MemoryCandleModel } from '../memory/models/candle.model';
import { scrollToTop } from 'src/app/utils/scrolltotop';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { forkJoin } from 'rxjs';

export type PaymentTabsType = 'address' | 'payment';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, AfterViewInit {
  @ViewChild('legalModal') private legalModalComponent: ModalComponent;

  bannerHeight?: number;
  bannerPaddingTopHeight?: number;

  paymentForm: FormGroup;
  currentUser: UserType;

  totalPrice: number = 0.0;
  package: string = '';
  activeTabId: PaymentTabsType = 'payment';

  typeId: number;
  planId: number;
  memoryId: number;
  candleData: MemoryCandleModel;

  legalModalConfig: ModalConfig;

  constructor(
    private userManagementService: UserManagementService,
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private windowResizeService: WindowResizeService,
    private route: ActivatedRoute,
    private giftService: GiftManagementService,
    private memoryService: MemoryManagementService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  confirm() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    if (this.typeId == 1) {
      this.userManagementService.pay(this.currentUser?.id!).subscribe(result => {
        if (result.isSuccess) {
          scrollToTop();

          this.toastr.success(this.translate.instant('SUCCESS_MESSAGE'), this.translate.instant('SUCCESS'), {
            positionClass: 'toast-top-center',
            timeOut: 3000
          });

          setTimeout(() => {
            this.auth.logout();
          }, 3000);
        } else {
          scrollToTop();

          this.toastr.error(result.message, this.translate.instant('ERROR'), {
            positionClass: 'toast-top-center',
            timeOut: 3000
          });
        }
      });
    } else if (this.typeId == 2) {
      if (this.candleData.id > 0) {
        this.memoryService.updateCandle(this.candleData).subscribe(result => {
          if (result.isSuccess) {
            scrollToTop();

            this.toastr.success(this.translate.instant('SUCCESS_MESSAGE'), this.translate.instant('SUCCESS'), {
              positionClass: 'toast-top-center',
              timeOut: 3000
            });

            setTimeout(() => {
              this.router.navigate(['/memories/' + this.candleData.memoryId]);
            }, 3000);
          } else {
            scrollToTop();

            this.toastr.error(result.message, this.translate.instant('ERROR'), {
              positionClass: 'toast-top-center',
              timeOut: 3000
            });
          }
        });
      } else {
        this.memoryService.lightCandle(this.candleData).subscribe(result => {
          if (result.isSuccess) {
            scrollToTop();

            this.toastr.success(this.translate.instant('SUCCESS_MESSAGE'), this.translate.instant('SUCCESS'), {
              positionClass: 'toast-top-center',
              timeOut: 3000
            });

            setTimeout(() => {
              this.router.navigate(['/memories/' + this.candleData.memoryId]);
            }, 3000);
          } else {
            scrollToTop();

            this.toastr.error(result.message, this.translate.instant('ERROR'), {
              positionClass: 'toast-top-center',
              timeOut: 3000
            });
          }
        });
      }
    } else if (this.typeId == 3) {
      const data: GiftModel = this.paymentForm.getRawValue();

      data.price = this.totalPrice;

      if (this.currentUser) {
        data.userId = this.currentUser?.id!;
      }

      this.giftService.addGift(data).subscribe(result => {
        if (result.isSuccess) {
          scrollToTop();

          this.toastr.success(this.translate.instant('SUCCESS_MESSAGE'), this.translate.instant('SUCCESS'), {
            positionClass: 'toast-top-center',
            timeOut: 3000
          });

          setTimeout(() => {
            this.router.navigate(['/giftvoucher']);
          }, 3000);
        } else {
          scrollToTop();

          this.toastr.error(result.message, this.translate.instant('ERROR'), {
            positionClass: 'toast-top-center',
            timeOut: 3000
          });
        }
      });
    } else if (this.typeId == 4) {
      this.userManagementService.buyPackage(
        this.currentUser?.id!,
        this.planId,
        this.memoryId ? this.memoryId : 0
      ).subscribe(result => {
        if (result.isSuccess) {
          scrollToTop();

          this.toastr.success(this.translate.instant('SUCCESS_MESSAGE'), this.translate.instant('SUCCESS'), {
            positionClass: 'toast-top-center',
            timeOut: 3000
          });

          setTimeout(() => {
            this.auth.logout();
          }, 3000);
        } else {
          scrollToTop();

          this.toastr.error(result.message, this.translate.instant('ERROR'), {
            positionClass: 'toast-top-center',
            timeOut: 3000
          });
        }
      });
    }
  }

  openLegalModal() {
    const keys = ['LEGAL_APPROVAL_TITLE', 'OK', 'CANCEL'];
    const translations: any = {};

    const observables = keys.map(key => this.translate.get(key));

    forkJoin(observables).subscribe(results => {
      keys.forEach((key, index) => {
        translations[key] = results[index];
      });

      this.legalModalConfig = {
        modalTitle: translations['LEGAL_APPROVAL_TITLE'],
        dismissButtonLabel: translations['OK'],
        closeButtonLabel: translations['CANCEL'],
        onDismiss: this.acceptLegalTerms.bind(this),
      };

      this.legalModalComponent.open({ size: 'lg', backdrop: 'static' });
    });
  }

  acceptLegalTerms() {
    this.paymentForm.get('termsAccepted')?.setValue(true);
    this.paymentForm.get('termsAccepted')?.markAsTouched();
    this.paymentForm.get('termsAccepted')?.updateValueAndValidity();

    return true;
  }

  formatCvc(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.substring(0, 4);
    this.paymentForm.get('cvv')?.setValue(value, { emitEvent: false });
  }

  formatCardHolder(event: any) {
    const value = event.target.value
      .toUpperCase()
      .replace(/[^A-ZÇĞİÖŞÜ ]/g, '');

    this.paymentForm.get('fullname')?.setValue(value, { emitEvent: false });
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();

    this.paymentForm.get('cardno')?.setValue(value, { emitEvent: false });
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length >= 3) {
      value = value.substring(0, 4);
      value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }

    this.paymentForm.get('expiryDate')?.setValue(value, { emitEvent: false });
  }

  initForm() {
    this.paymentForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.pattern(/^[A-ZÇĞİÖŞÜ ]{2,}$/)]],
      cardno: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      termsAccepted: [false, Validators.requiredTrue],
    });
  }

  removeGiftControls() {
    if (this.paymentForm.contains('senderEmail')) {
      this.paymentForm.removeControl('senderEmail');
    }

    if (this.paymentForm.contains('senderFullName')) {
      this.paymentForm.removeControl('senderFullName');
    }

    if (this.paymentForm.contains('receiverEmail')) {
      this.paymentForm.removeControl('receiverEmail');
    }

    if (this.paymentForm.contains('message')) {
      this.paymentForm.removeControl('message');
    }

    if (this.paymentForm.contains('planId')) {
      this.paymentForm.removeControl('planId');
    }
  }

  ngOnInit(): void {
    this.windowResizeService.resize$
      .subscribe(size => {
        this.bannerHeight = (size.height / 2) - document.getElementById('kt_header')?.clientHeight!;
        this.bannerPaddingTopHeight = this.bannerHeight / 4;
      });

    this.initForm();
    this.currentUser = this.auth.currentUserValue!;

    this.route.queryParams.subscribe(params => {
      this.typeId = Number(params.typeId);

      if (this.typeId == 1) {
        this.removeGiftControls();

        if (params.role == 2) {
          this.totalPrice = 359.00;
          this.package = 'Anı (Memory) Paketi';
        } else if (params.role == 3) {
          this.totalPrice = 559.00;
          this.package = 'Hatıra (Tribute) Paketi';
        } else if (params.role == 4) {
          this.totalPrice = 959.00;
          this.package = 'Sonsuz (Eternal) Paketi';
        }
      } else if (this.typeId == 2) {
        this.removeGiftControls();

        this.candleData = JSON.parse(params.data);
        this.totalPrice = this.candleData.donation!;
        this.package = 'Mum Yakma (Light a Candle)';
      } else if (this.typeId == 3) {
        if (!this.currentUser) {
          this.paymentForm.addControl(
            'senderEmail',
            this.fb.control('', [Validators.required, Validators.email])
          );

          this.paymentForm.addControl(
            'senderFullName',
            this.fb.control('', Validators.required)
          );
        }

        this.paymentForm.addControl('receiverEmail', this.fb.control('', Validators.required));
        this.paymentForm.addControl('message', this.fb.control('', Validators.required));
        this.paymentForm.addControl('planId', this.fb.control(params.selectedPlan, Validators.required));

        this.planId = params.selectedPlan;

        if (params.selectedPlan == 2) {
          this.totalPrice = 359.00;
          this.package = 'Anı (Memory) Paketi';
        } else if (params.selectedPlan == 3) {
          this.totalPrice = 559.00;
          this.package = 'Hatıra (Tribute) Paketi';
        } else if (params.selectedPlan == 4) {
          this.totalPrice = 959.00;
          this.package = 'Sonsuz (Eternal) Paketi';
        }
      } else if (this.typeId == 4) {
        this.removeGiftControls();

        this.planId = params.selectedPlan;
        this.memoryId = params.memoryId;

        if (params.selectedPlan == 2) {
          this.totalPrice = 359.00;
          this.package = 'Anı (Memory) Paketi';
        } else if (params.selectedPlan == 3) {
          this.totalPrice = 559.00;
          this.package = 'Hatıra (Tribute) Paketi';
        } else if (params.selectedPlan == 4) {
          this.totalPrice = 959.00;
          this.package = 'Sonsuz (Eternal) Paketi';
        }
      }
    });
  }

  ngAfterViewInit(): void {}

  setActiveTabId(tabId: PaymentTabsType) {
    this.activeTabId = tabId;
  }
}