import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subscription, timer } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService, UserType } from '../auth';
import { UserManagementService } from '../user-management/user-management.service';
import { GiftManagementService } from '../gift/gift-management.service';
import { GiftModel } from '../gift/models/gift.model';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { scrollToTop } from 'src/app/utils/scrolltotop';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';

export type PaymentTabsType = 'payment';

interface ShopierPaymentData {
  reference: string;
  redirectUrl: string;
  buyerEmail?: string;
  message?: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('legalModal') private legalModalComponent: ModalComponent;

  bannerHeight?: number;
  bannerPaddingTopHeight?: number;
  paymentForm: FormGroup;
  currentUser: UserType;
  totalPrice = 0;
  packageKey = '';
  activeTabId: PaymentTabsType = 'payment';
  typeId: number;
  planId: number;
  memoryId: number;
  roleId: number;
  legalModalConfig: ModalConfig;
  processing = false;
  confirming = false;
  pendingReference: string | null = null;
  pendingRedirectUrl: string | null = null;
  private paymentStatusSubscription?: Subscription;
  private shopierWindow: Window | null = null;

  constructor(
    private userManagementService: UserManagementService,
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private windowResizeService: WindowResizeService,
    private route: ActivatedRoute,
    private giftService: GiftManagementService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.windowResizeService.resize$.subscribe(size => {
      this.bannerHeight = (size.height / 2) - document.getElementById('kt_header')?.clientHeight!;
      this.bannerPaddingTopHeight = this.bannerHeight / 4;
    });

    this.currentUser = this.auth.currentUserValue!;
    this.initForm();

    this.route.queryParams.subscribe(params => {
      this.typeId = Number(params.typeId);
      this.roleId = Number(params.role || 0);
      this.planId = Number(params.selectedPlan || 0);
      this.memoryId = Number(params.memoryId || 0);

      // Mum yakma artık ücretli değildir ve payment ekranından yürütülmez.
      if (this.typeId === 2) {
        this.router.navigate(['/']);
        return;
      }

      if (this.typeId === 3) {
        this.addGiftControls(params.selectedPlan);
        this.setPackage(Number(params.selectedPlan));
      } else {
        this.removeGiftControls();
        this.setPackage(this.typeId === 1 ? this.roleId : this.planId);
      }

      this.loadPendingPayment();
    });
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.stopPaymentStatusPolling();
    this.closeShopierWindow();
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      termsAccepted: [false, Validators.requiredTrue],
    });
  }

  confirm(): void {
    if (this.processing) return;
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    if (!this.currentUser?.id) {
      this.showError(this.translate.instant('SHOPIER.LOGIN_REQUIRED'));
      return;
    }

    // Yeni sekme mutlaka doğrudan kullanıcı tıklaması sırasında açılmalıdır.
    // HTTP isteği/subscription tamamlandıktan sonra window.open çağrılırsa
    // tarayıcı bunu popup olarak engelleyebilir veya aynı sekmede açabilir.
    if (!this.openShopierWindow()) return;

    this.processing = true;
    this.startPayment();
  }

  private startPayment(): void {
    if (this.typeId === 1) {
      this.userManagementService.pay(this.currentUser?.id!).subscribe({ next: r => this.handlePaymentCreation(r), error: e => this.handleError(e) }); return;
    }
    if (this.typeId === 3) {
      const data: GiftModel = this.paymentForm.getRawValue();
      data.price = this.totalPrice;
      data.planId = this.planId;
      data.userId = this.currentUser?.id!;
      this.giftService.addGift(data).subscribe({ next: r => this.handlePaymentCreation(r), error: e => this.handleError(e) }); return;
    }
    if (this.typeId === 4) {
      this.userManagementService.buyPackage(this.currentUser?.id!, this.planId, this.memoryId || 0).subscribe({ next: r => this.handlePaymentCreation(r), error: e => this.handleError(e) }); return;
    }
    this.processing = false;
  }

  confirmShopierPayment(silent = false): void {
    if (!this.pendingReference || this.confirming) return;

    this.confirming = true;
    this.userManagementService.confirmShopierPayment(this.pendingReference).subscribe({
      next: result => {
        this.confirming = false;

        if (!result?.isSuccess) {
          // Otomatik kontrolde ödeme henüz Shopier tarafında görünmüyorsa
          // kullanıcıyı hata mesajıyla rahatsız etme; manuel kontrol butonu kalır.
          if (!silent) {
            this.showError(result?.message || this.translate.instant('SHOPIER.PAYMENT_NOT_VERIFIED'));
          }
          return;
        }

        this.pendingReference = null;
        this.pendingRedirectUrl = null;
        scrollToTop();
        this.toastr.success(
          this.translate.instant('SUCCESS_MESSAGE'),
          this.translate.instant('SUCCESS'),
          { positionClass: 'toast-top-center', timeOut: 3000 }
        );

        setTimeout(() => {
          if (this.typeId === 3) {
            this.router.navigate(['/giftvoucher']);
            return;
          }

          this.auth.logout();
        }, 1500);
      },
      error: error => {
        this.confirming = false;
        if (!silent) this.handleError(error, false);
      }
    });
  }

  private handlePaymentCreation(result: any): void {
    if (!result?.isSuccess) {
      this.processing = false;
      this.closeShopierWindow();
      this.showError(result?.message || this.translate.instant('SHOPIER.PAYMENT_START_FAILED'));
      return;
    }

    const data: ShopierPaymentData = result.data || result.Data;
    const reference = data?.reference || (<any>data)?.Reference;
    const redirectUrl = data?.redirectUrl || (<any>data)?.RedirectUrl;

    if (!reference || !redirectUrl) {
      this.processing = false;
      this.closeShopierWindow();
      this.showError(this.translate.instant('SHOPIER.LINK_NOT_RECEIVED'));
      return;
    }

    this.savePurchaseAgreements(reference, redirectUrl);
  }

  private savePurchaseAgreements(reference: string, redirectUrl: string): void {
    const userId = this.currentUser?.id;
    if (!userId) {
      this.processing = false;
      this.closeShopierWindow();
      this.showError(this.translate.instant('SHOPIER.LOGIN_REQUIRED'));
      return;
    }

    const language = this.translate.currentLang || 'tr';
    const snapshot = this.getLegalContentSnapshot();
    const agreements = [
      {
        userId,
        agreementType: 'PreInformationForm',
        title: this.translate.instant('PRE_INFORMATION_FORM'),
        version: '2026.08',
        language,
        context: 'Purchase',
        documentUrl: '/distance-sales-agreement',
        contentSnapshot: snapshot,
        relatedReference: reference
      },
      {
        userId,
        agreementType: 'DistanceSalesAgreement',
        title: this.translate.instant('DISTANCE_SALES_CONTRACT'),
        version: '2026.08',
        language,
        context: 'Purchase',
        documentUrl: '/distance-sales-agreement',
        contentSnapshot: snapshot,
        relatedReference: reference
      }
    ];

    this.userManagementService.acceptAgreements(agreements).subscribe({
      next: r => {
        this.processing = false;
        if (!r.isSuccess) {
          this.closeShopierWindow();
          this.showError(r.message || this.translate.instant('SHOPIER.AGREEMENT_SAVE_FAILED'));
          return;
        }
        this.pendingReference = reference;
        this.pendingRedirectUrl = redirectUrl;
        this.startPaymentStatusPolling();
        this.navigateShopierWindow(redirectUrl);
      },
      error: e => this.handleError(e)
    });
  }

  private getLegalContentSnapshot(): string {
    const element = document.querySelector('.legal-modal-content') as HTMLElement | null;
    return element?.innerText?.trim() || '';
  }

  private loadPendingPayment(): void {
    this.pendingReference = null;
    this.pendingRedirectUrl = null;
    if (!this.currentUser?.id) return;

    const purchaseType = this.typeId === 1 ? 'Pay' : this.typeId === 3 ? 'Gift' : 'Package';
    const planId = this.typeId === 1 ? this.roleId : this.planId;
    const memoryId = this.typeId === 4 ? (this.memoryId || 0) : 0;

    this.userManagementService
      .getPendingShopierPayment(this.currentUser.id, purchaseType, planId, memoryId)
      .subscribe({
        next: result => {
          if (!result?.isSuccess) return;
          const data: any = result.data || (<any>result).Data;
          this.pendingReference = data?.reference || data?.Reference || null;
          this.pendingRedirectUrl = data?.redirectUrl || data?.RedirectUrl || null;
          if (this.pendingReference) this.startPaymentStatusPolling();
        },
        error: () => { }
      });
  }

  private startPaymentStatusPolling(): void {
    this.stopPaymentStatusPolling();
    if (!this.pendingReference) return;

    const reference = this.pendingReference;
    this.paymentStatusSubscription = timer(0, 3000).subscribe(() => {
      this.userManagementService.shopierPaymentStatus(reference).subscribe({
        next: result => {
          if (!result?.isSuccess) {
            const message =
              result?.message ||
              this.translate.instant('SHOPIER.PAYMENT_STATUS_FAILED');

            this.handleFailedPayment(message);
            return;
          }

          const data: any = result.data || (<any>result).Data;
          const status = String(data?.status || data?.Status || '').toLowerCase();
          const orderId = data?.shopierOrderId || data?.ShopierOrderId;

          if (status === 'completed' && !!orderId) {
            this.handleCompletedPayment();
            return;
          }

          if (this.isFailedPaymentStatus(status)) {
            const message =
              data?.message ||
              result?.message ||
              this.translate.instant('SHOPIER.PAYMENT_FAILED');

            this.handleFailedPayment(message);
          }
        },
        error: () => { }
      });
    });
  }

  private stopPaymentStatusPolling(): void {
    this.paymentStatusSubscription?.unsubscribe();
    this.paymentStatusSubscription = undefined;
  }

  private handleCompletedPayment(): void {
    if (this.confirming) return;
    this.confirming = true;
    this.stopPaymentStatusPolling();
    this.pendingReference = null;
    this.pendingRedirectUrl = null;
    scrollToTop();
    const successMessageKey =
      this.typeId === 3
        ? 'SHOPIER.GIFT_PAYMENT_SUCCESS'
        : this.typeId === 4
          ? 'SHOPIER.PACKAGE_PAYMENT_SUCCESS'
          : 'SHOPIER.MEMBERSHIP_PAYMENT_SUCCESS';

    this.toastr.success(
      this.translate.instant(successMessageKey),
      this.translate.instant('SUCCESS'),
      { positionClass: 'toast-top-center', timeOut: 2500 }
    );

    setTimeout(() => {
      if (this.typeId === 3) {
        this.router.navigate(['/giftvoucher']);
        return;
      }
      this.auth.logout();
    }, 1200);
  }

  private isFailedPaymentStatus(status: string): boolean {
    return [
      'failed',
      'cancelled',
      'canceled',
      'rejected',
      'refunded',
      'refund',
      'void',
      'expired',
      'error'
    ].includes(status);
  }

  private handleFailedPayment(message?: string): void {
    if (this.confirming) return;

    this.confirming = true;
    this.stopPaymentStatusPolling();
    this.processing = false;

    this.showError(
      message || this.translate.instant('SHOPIER.PAYMENT_FAILED')
    );

    setTimeout(() => {
      this.confirming = false;
      this.loadPendingPayment();
    }, 1500);
  }

  private addGiftControls(selectedPlan: any): void {
    if (!this.currentUser) {
      this.paymentForm.addControl('senderEmail', this.fb.control('', [Validators.required, Validators.email]));
      this.paymentForm.addControl('senderFullName', this.fb.control('', Validators.required));
    }
    this.paymentForm.addControl('receiverEmail', this.fb.control('', [Validators.required, Validators.email]));
    this.paymentForm.addControl('message', this.fb.control('', Validators.required));
    this.paymentForm.addControl('planId', this.fb.control(Number(selectedPlan), Validators.required));
  }

  private removeGiftControls(): void {
    ['senderEmail', 'senderFullName', 'receiverEmail', 'message', 'planId'].forEach(key => {
      if (this.paymentForm.contains(key)) this.paymentForm.removeControl(key);
    });
  }

  private setPackage(role: number): void {
    if (role === 2) { this.totalPrice = 359; this.packageKey = 'SHOPIER.PACKAGES.MEMORY'; }
    else if (role === 3) { this.totalPrice = 559; this.packageKey = 'SHOPIER.PACKAGES.TRIBUTE'; }
    else if (role === 4) { this.totalPrice = 959; this.packageKey = 'SHOPIER.PACKAGES.ETERNAL'; }
  }

  reopenShopier(): void {
    if (!this.ensureTermsAccepted()) return;

    if (!this.pendingRedirectUrl) {
      this.showError(this.translate.instant('SHOPIER.LINK_NOT_RECEIVED'));
      return;
    }

    if (!this.openShopierWindow()) return;
    this.navigateShopierWindow(this.pendingRedirectUrl);
  }

  private openShopierWindow(): boolean {
    this.closeShopierWindow();

    const newTab = window.open('about:blank', '_blank');
    if (!newTab) {
      this.showError(this.translate.instant('SHOPIER.POPUP_BLOCKED'));
      return false;
    }

    newTab.opener = null;
    this.shopierWindow = newTab;
    return true;
  }

  private navigateShopierWindow(url: string): void {
    if (!this.shopierWindow || this.shopierWindow.closed) {
      this.showError(this.translate.instant('SHOPIER.POPUP_BLOCKED'));
      return;
    }

    this.shopierWindow.location.href = url;
    this.shopierWindow = null;
  }

  private closeShopierWindow(): void {
    if (this.shopierWindow && !this.shopierWindow.closed) {
      this.shopierWindow.close();
    }
    this.shopierWindow = null;
  }

  private ensureTermsAccepted(): boolean {
    const termsControl = this.paymentForm.get('termsAccepted');
    if (termsControl?.value === true) return true;

    termsControl?.markAsTouched();
    termsControl?.updateValueAndValidity();
    this.showError(this.translate.instant('SHOPIER.TERMS_REQUIRED'));
    return false;
  }

  openLegalModal(): void {
    const keys = ['LEGAL_APPROVAL_TITLE', 'OK', 'CANCEL'];
    forkJoin(keys.map(key => this.translate.get(key))).subscribe(results => {
      const translations: any = {};
      keys.forEach((key, index) => translations[key] = results[index]);
      this.legalModalConfig = {
        modalTitle: translations.LEGAL_APPROVAL_TITLE,
        dismissButtonLabel: translations.OK,
        closeButtonLabel: translations.CANCEL,
        onDismiss: this.acceptLegalTerms.bind(this),
      };
      this.legalModalComponent.open({ size: 'lg', backdrop: 'static' });
    });
  }

  acceptLegalTerms(): boolean {
    this.paymentForm.get('termsAccepted')?.setValue(true);
    this.paymentForm.get('termsAccepted')?.markAsTouched();
    this.paymentForm.get('termsAccepted')?.updateValueAndValidity();
    return true;
  }

  setActiveTabId(tabId: PaymentTabsType): void { this.activeTabId = tabId; }

  private handleError(error: any, resetProcessing = true): void {
    if (resetProcessing) {
      this.processing = false;
      this.closeShopierWindow();
    }
    this.showError(error?.error?.message || error?.error?.Message || error?.message || this.translate.instant('SHOPIER.GENERIC_ERROR'));
  }

  private showError(message: string): void {
    scrollToTop();
    this.toastr.error(message, this.translate.instant('ERROR'), {
      positionClass: 'toast-top-center', timeOut: 4000
    });
  }
}