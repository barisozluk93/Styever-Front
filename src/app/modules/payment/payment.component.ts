import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import { LayoutInitService } from 'src/app/_metronic/layout/core/layout-init.service';
import { UserManagementService } from '../user-management/user-management.service';
import { AuthService } from '../auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthModel } from '../auth/models/auth.model';
import { UserAddressModel } from '../user-management/models/user-address.model';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { AddressEditSaveComponent } from '../account/addresses/forms/list/edit-save/edit-save.component';

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

  totalPrice: number = 0.0;
  activeTabId: PaymentTabsType = "address";

  deliveryAddresses: UserAddressModel[] = [];
  invoiceAddresses: UserAddressModel[] = [];
  selectedDeliveryAddressId: number;
  selectedDeliveryAddress: UserAddressModel;
  selectedInvoiceAddressId: number;
  currentUser: any;
 
  @ViewChild('editSaveComponent') private editSaveComponent: AddressEditSaveComponent;

  constructor(
    private userManagementService: UserManagementService,
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private windowResizeService: WindowResizeService,
  ) {
  }

  confirm() {
    this.router.navigate(['/about'], {
        queryParams: {},
      }); 
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

  loadDeliveryAddresses() {
    this.userManagementService.userAddressList(this.currentUser.id).subscribe(result => {
      if(result.isSuccess) {
        let i = 0;
        result.data.forEach(item => {
          if(i == 0) {
            item.selected = true;
            this.selectedDeliveryAddressId = item.id;
            this.selectedDeliveryAddress = item;
          }
          else{
            item.selected = false;
          }

          i++;
        })

        this.deliveryAddresses = result.data;
      }
      else{
        this.deliveryAddresses = [];
      }
    })
  }

  loadInvoiceAddresses() {
    this.userManagementService.userAddressList(this.currentUser.id).subscribe(result => {
      if(result.isSuccess) {
        let i = 0;
        result.data.forEach(item => {
          if(i == 0) {
            item.selected = true;
            this.selectedInvoiceAddressId = item.id;
          }
          else{
            item.selected = false;
          }

          i++;
        })

        this.invoiceAddresses = result.data;
      }
      else{
        this.invoiceAddresses = [];
      }
    })
  }

  ngOnInit(): void {
    this.windowResizeService.resize$
    .subscribe(size => {
      this.bannerHeight =  (size.height / 2) - document.getElementById("kt_header")?.clientHeight!;
      this.bannerPaddingTopHeight = this.bannerHeight / 4;
    });

    this.initForm();

    const currentUser = this.auth.currentUserValue;
    if (currentUser) {
      this.currentUser = currentUser;
      
      if (currentUser?.roles) {
        let roleList = (JSON.parse(currentUser?.roles) as number[]);

        if(roleList[0] == 2) {
          this.totalPrice = 359.00;
        }
        else if(roleList[0] == 3) {
          this.totalPrice = 559.00;
        }
        else if(roleList[0] == 4) {
          this.totalPrice = 959.00;
        }
      }

      this.loadDeliveryAddresses();
      this.loadInvoiceAddresses();
    }
  }

  ngAfterViewInit(): void {
    
  }

  onCheckboxClicked() {
    if(this.selectedDeliveryAddressId == this.selectedInvoiceAddressId) {
      this.invoiceAddresses.forEach(item => {
        if(item.id == this.selectedInvoiceAddressId) {
          item.selected = false;
        }
      })

      this.selectedInvoiceAddressId = 0;
    }
    else{
      this.invoiceAddresses.forEach(item => {
        item.selected = false;

        if(item.id == this.selectedDeliveryAddressId) {
          item.selected = true;
        }
      })

      this.selectedInvoiceAddressId = this.selectedDeliveryAddressId;
    }
  }

  selectDeliveryAddress(id: number) {
    if(id != this.selectedDeliveryAddressId) {
      this.deliveryAddresses.forEach(item => {
        if(item.id == id) {
          item.selected = true;
          this.selectedDeliveryAddress = item;
        }

        if(item.id == this.selectedDeliveryAddressId) {
          item.selected = false;
        }
      })

      this.selectedDeliveryAddressId = id;
    }

  }

  selectInvoiceAddress(id: number) {
    if(id != this.selectedInvoiceAddressId) {
      this.invoiceAddresses.forEach(item => {
        if(item.id == id) {
          item.selected = true;
        }

        if(item.id == this.selectedInvoiceAddressId) {
          item.selected = false;
        }
      })

      this.selectedInvoiceAddressId = id;
    }
  }

  setActiveTabId(tabId: PaymentTabsType) {
    this.activeTabId = tabId;
  }

  openEditModal(id: number) {
    this.editSaveComponent.openModal(this.currentUser.id, id);
  }

  openSaveModal() {
    this.editSaveComponent.openModal(this.currentUser.id, undefined);
  }

  isSuccess(event: boolean) {
    this.loadDeliveryAddresses();
    this.loadInvoiceAddresses();
  }
}
