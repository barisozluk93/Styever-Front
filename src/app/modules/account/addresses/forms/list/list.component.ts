import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/_metronic/partials/layout/alert/alert.service';
import { ConfirmationComponent } from 'src/app/modules/confirmation/confirmation.component';
import { UserAddressModel } from 'src/app/modules/user-management/models/user-address.model';
import { UserModel } from 'src/app/modules/user-management/models/user.model';
import { UserManagementService } from 'src/app/modules/user-management/user-management.service';
import { AddressEditSaveComponent } from './edit-save/edit-save.component';
import { parseBoolean } from 'src/app/utils/parse-boolean';
import { AuthService } from 'src/app/modules/auth';
import { ToastrService } from 'ngx-toastr';
import { scrollToTop } from 'src/app/utils/scrolltotop';

@Component({
  selector: 'app-address-list',
  templateUrl: './list.component.html',
})
export class AddressListComponent implements OnInit, OnDestroy {

  @ViewChild('confirmationComponent') private confirmationComponent: ConfirmationComponent;
  @ViewChild('editSaveComponent') private editSaveComponent: AddressEditSaveComponent;

  @Input() user: UserModel;
  addresses: UserAddressModel[] = [];
  isUserActive: boolean;

  constructor(private userManagementService: UserManagementService,
    private toastr: ToastrService, private translate: TranslateService,
    private authService: AuthService
  ) {

  }

  delete(event: number) {
    this.userManagementService.userAddressDelete(event).subscribe(result => {
      if (result.isSuccess) {
        scrollToTop();
        this.toastr.success(this.translate.instant('SUCCESS_MESSAGE'), this.translate.instant('SUCCESS'), {
          positionClass: 'toast-top-right',
          timeOut: 3000
        });
        this.loadData();
      }
      else {
        scrollToTop();

        this.toastr.error(result.message, this.translate.instant('ERROR'), {
          positionClass: 'toast-top-right',
          timeOut: 3000
        });
      }
    })
  }

  isSuccess(event: boolean) {
    this.loadData();
  }

  loadData() {
    this.userManagementService.userAddressList(this.user.id).subscribe(result => {
      if (result.isSuccess) {
        this.addresses = result.data;
      }
      else {
        this.addresses = [];
      }

      console.log(this.addresses);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user) {
      if (this.user) {
        this.loadData();
      }
    }
  }

  ngOnInit(): void {
    this.isUserActive = parseBoolean(this.authService.currentUserValue?.isActive);
  }

  ngOnDestroy() {
  }

  openDeleteModal(id: number) {
    var deleteText = "";
    this.translate.get('DELETE').subscribe((translation) => {
      deleteText = translation
    })
    this.confirmationComponent.openModal(deleteText, id);
  }

  openEditModal(id: number) {
    this.editSaveComponent.openModal(this.user.id, id);
  }

  openSaveModal() {
    this.editSaveComponent.openModal(this.user.id, undefined);
  }
}
