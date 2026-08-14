import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { FAQManagementService } from '../../faq/faq-management.service';
import { FAQModel } from '../../faq/models/faq.model';

@Component({ selector: 'app-faq-admin-editsave', templateUrl: './edit-save.component.html' })
export class FAQEditSaveComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @Output() isSuccess = new EventEmitter<boolean>();
  form: FormGroup;
  modalConfig: ModalConfig;
  constructor(private fb: FormBuilder, private service: FAQManagementService, private toastr: ToastrService, private translate: TranslateService) {}
  ngOnInit(): void { this.form = this.fb.group({ id: [0], header: ['', Validators.required], headerEn: ['', Validators.required], content: ['', Validators.required], contentEn: ['', Validators.required], isDeleted: [false] }); }
  openModal(item?: FAQModel): void {
    forkJoin(['NEW_RECORD','EDIT','SUBMIT','CANCEL'].map(k => this.translate.get(k))).subscribe(t => {
      this.modalConfig = { modalTitle: item ? t[1] : t[0], dismissButtonLabel: t[2], closeButtonLabel: t[3], onDismiss: this.submit.bind(this), shouldDismiss: () => this.form.valid };
      this.form.reset(item ? { ...item } : { id: 0, header: '', headerEn: '', content: '', contentEn: '', isDeleted: false });
      this.modal.open({ size: 'xl', centered: true, scrollable: true });
    });
  }
  submit(): boolean {
    if (!this.form.valid) { this.form.markAllAsTouched(); return false; }
    const data = this.form.getRawValue() as FAQModel;
    const request = data.id ? this.service.update(data) : this.service.save(data);
    request.subscribe(result => { result.isSuccess ? this.toastr.success(result.message) : this.toastr.error(result.message); if (result.isSuccess) this.isSuccess.emit(true); });
    return true;
  }
}
