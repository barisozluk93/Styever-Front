import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { PlanManagementService, PlanModel } from '../../common/plans/plan-management.service';

@Component({ selector: 'app-plan-editsave', templateUrl: './edit-save.component.html' })
export class PlanEditSaveComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @Output() isSuccess = new EventEmitter<boolean>();
  form: FormGroup;
  modalConfig: ModalConfig;

  constructor(private fb: FormBuilder, private service: PlanManagementService, private toastr: ToastrService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [0], name: ['', Validators.required], nameEn: ['', Validators.required], price: [0, [Validators.required, Validators.min(0)]],
      currency: ['₺', Validators.required], period: ['Yıl', Validators.required], periodEn: ['Year', Validators.required],
      properties: ['', Validators.required], propertiesEn: ['', Validators.required], sortOrder: [0, Validators.required], isPopular: [false], isDeleted: [false]
    });
  }

  openModal(item?: PlanModel): void {
    this.modalConfig = {
      modalTitle: this.translate.instant(item ? 'ADMIN_PLAN.EDIT_TITLE' : 'ADMIN_PLAN.NEW_TITLE'),
      dismissButtonLabel: this.translate.instant('SUBMIT'), closeButtonLabel: this.translate.instant('CANCEL'),
      onDismiss: this.submit.bind(this), shouldDismiss: () => this.form.valid
    };
    this.form.reset(item ? { ...item } : { id:0, name:'', nameEn:'', price:0, currency:'₺', period:'Yıl', periodEn:'Year', properties:'', propertiesEn:'', sortOrder:0, isPopular:false, isDeleted:false });
    this.modal.open({ size: 'xl', centered: true, scrollable: true });
  }

  submit(): boolean {
    if (this.form.invalid) { this.form.markAllAsTouched(); return false; }
    const data = this.form.getRawValue() as PlanModel;
    const request = data.id ? this.service.update(data) : this.service.save(data);
    request.subscribe(result => {
      result?.isSuccess ? this.toastr.success(result.message) : this.toastr.error(result?.message);
      if (result?.isSuccess) this.isSuccess.emit(true);
    });
    return true;
  }
}
