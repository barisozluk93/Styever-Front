import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { LegalContentModel, LegalContentService } from '../../common/legal-content/legal-content.service';

@Component({ selector: 'app-legal-content-editsave', templateUrl: './edit-save.component.html' })
export class LegalContentEditSaveComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @Output() isSuccess = new EventEmitter<boolean>();
  form: FormGroup;
  modalConfig: ModalConfig;
  constructor(private fb: FormBuilder, private service: LegalContentService, private toastr: ToastrService, private translate: TranslateService) {}
  ngOnInit(): void { this.form = this.fb.group({ id:[0], slug:['',Validators.required], category:['Legal',Validators.required], title:['',Validators.required], titleEn:['',Validators.required], content:['',Validators.required], contentEn:['',Validators.required], sortOrder:[0,Validators.required], isDeleted:[false] }); }
  openModal(item?: LegalContentModel): void {
    this.modalConfig = { modalTitle: this.translate.instant(item ? 'ADMIN_LEGAL_CONTENT.EDIT_TITLE' : 'ADMIN_LEGAL_CONTENT.NEW_TITLE'), dismissButtonLabel:this.translate.instant('SUBMIT'), closeButtonLabel:this.translate.instant('CANCEL'), onDismiss:this.submit.bind(this), shouldDismiss:()=>this.form.valid };
    this.form.reset(item ? {...item} : {id:0,slug:'',category:'Legal',title:'',titleEn:'',content:'',contentEn:'',sortOrder:0,isDeleted:false});
    this.modal.open({size:'xl',centered:true,scrollable:true});
  }
  submit(): boolean {
    if(this.form.invalid){this.form.markAllAsTouched();return false;}
    const data=this.form.getRawValue() as LegalContentModel;
    (data.id ? this.service.update(data) : this.service.save(data)).subscribe(r=>{r?.isSuccess?this.toastr.success(r.message):this.toastr.error(r?.message);if(r?.isSuccess)this.isSuccess.emit(true);});
    return true;
  }
}
