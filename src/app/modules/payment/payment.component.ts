import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import { LayoutInitService } from 'src/app/_metronic/layout/core/layout-init.service';
import { UserManagementService } from '../user-management/user-management.service';
import { AuthService, UserType } from '../auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthModel } from '../auth/models/auth.model';
import { UserAddressModel } from '../user-management/models/user-address.model';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { AddressEditSaveComponent } from '../account/addresses/forms/list/edit-save/edit-save.component';
import { GiftModel } from '../gift/models/gift.model';
import { GiftManagementService } from '../gift/gift-management.service';
import { MemoryManagementService } from '../memory/memory-management.service';
import { MemoryCandleModel } from '../memory/models/candle.model';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];


export type PaymentTabsType =
  | 'address'
  | 'payment';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, AfterViewInit {
  bannerHeight?: number;
  bannerPaddingTopHeight?: number;

  paymentForm: FormGroup;
  currentUser: UserType;

  totalPrice: number = 0.0;
  activeTabId: PaymentTabsType = "payment";

  typeId: number;
  planId: number;
  candleData: MemoryCandleModel;

  @ViewChild('editSaveComponent') private editSaveComponent: AddressEditSaveComponent;

  constructor(
    private userManagementService: UserManagementService,
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private windowResizeService: WindowResizeService,
    private route: ActivatedRoute,
    private giftService: GiftManagementService,
    private memoryService: MemoryManagementService
  ) {
  }

  confirm() {
    if(this.typeId == 1) {
      this.userManagementService.pay(this.currentUser?.id!).subscribe(result => {
        if(result.isSuccess) {
          //alert

          this.auth.logout();
        }
      })
    }
    else if(this.typeId == 2) {
      this.memoryService.updateCandle(this.candleData).subscribe(result => {
        if(result.isSuccess) {
          //alert

          this.router.navigate(['/memories/' + this.candleData.memoryId]);
        }
      })
    }
    else if(this.typeId == 3) {
      var data: GiftModel = this.paymentForm.getRawValue();
      data.price = this.totalPrice;
      if(this.currentUser) {
        data.userId = this.currentUser?.id!;
      }

      this.giftService.addGift(data).subscribe(result => {
        if(result.isSuccess) {
          //alert

          this.router.navigate(['/standby']);
        }
      })

    }
    if(this.typeId == 4) {
      this.userManagementService.buyPackage(this.currentUser?.id!, this.planId).subscribe(result => {
        if(result.isSuccess) {
          //alert

          this.auth.logout();
        }
      })
    }
  }

  initForm() {
    this.paymentForm = this.fb.group(
      {
        fullname: ['', Validators.required],
        cardno: ['', Validators.required],
        expiryDate: ['', Validators.required],
        cvv: ['', Validators.required],
      });
  }

  ngOnInit(): void {
    this.windowResizeService.resize$
      .subscribe(size => {
        this.bannerHeight = (size.height / 2) - document.getElementById("kt_header")?.clientHeight!;
        this.bannerPaddingTopHeight = this.bannerHeight / 4;
      });

    this.initForm();
    this.currentUser = this.auth.currentUserValue!;

    this.route.queryParams.subscribe(params => {
      this.typeId = params.typeId;
      if (params.typeId == 1) {
        this.paymentForm.removeControl('senderEmail');
        this.paymentForm.removeControl('receiverEmail');
        this.paymentForm.removeControl('message');
        this.paymentForm.removeControl('planId');

        if (params.role == 2) {
          this.totalPrice = 359.00;
        }
        else if (params.role == 3) {
          this.totalPrice = 559.00;
        }
        else if (params.role == 4) {
          this.totalPrice = 959.00;
        }
      }
      else if (params.typeId == 2) {
        this.paymentForm.removeControl('senderEmail');
        this.paymentForm.removeControl('receiverEmail');
        this.paymentForm.removeControl('message');
        this.paymentForm.removeControl('planId');

        this.candleData = JSON.parse(params.data);
        this.totalPrice = this.candleData.donation!;
      }
      else if (params.typeId == 3) {
        if(!this.currentUser) {
          this.paymentForm.addControl('senderEmail', this.fb.control('', Validators.required));
        }
        
        this.paymentForm.addControl('receiverEmail', this.fb.control('', Validators.required));
        this.paymentForm.addControl('message', this.fb.control('', Validators.required));
        this.paymentForm.addControl('planId', this.fb.control(params.selectedPlan, Validators.required));

        this.planId = params.selectedPlan;
        if (params.selectedPlan == 2) {
          this.totalPrice = 359.00;
        }
        else if (params.selectedPlan == 3) {
          this.totalPrice = 559.00;
        }
        else if (params.selectedPlan == 4) {
          this.totalPrice = 959.00;
        }
      }
      else if (params.typeId == 4) {
        this.paymentForm.removeControl('senderEmail');        
        this.paymentForm.removeControl('receiverEmail');
        this.paymentForm.removeControl('message');
        this.paymentForm.removeControl('planId');

        this.planId = params.selectedPlan;

        if (params.selectedPlan == 2) {
          this.totalPrice = 359.00;
        }
        else if (params.selectedPlan == 3) {
          this.totalPrice = 559.00;
        }
        else if (params.selectedPlan == 4) {
          this.totalPrice = 959.00;
        }
      }
    });
  }

  ngAfterViewInit(): void {

  }

  setActiveTabId(tabId: PaymentTabsType) {
    this.activeTabId = tabId;
  }

  openEditModal(id: number) {
    this.editSaveComponent.openModal(this.currentUser?.id!, id);
  }

  openSaveModal() {
    this.editSaveComponent.openModal(this.currentUser?.id!, undefined);
  }
}
