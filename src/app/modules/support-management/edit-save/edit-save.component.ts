import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { ResultModel } from 'src/app/models/result.model';
import { ArticleManagementService } from '../../article/article-management.service';
import { ArticleModel } from '../../article/models/article.model';
import { environment } from 'src/environments/environment';

@Component({ selector: 'app-support-admin-editsave', templateUrl: './edit-save.component.html' })
export class SupportEditSaveComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @Output() isSuccess = new EventEmitter<boolean>();

  form: FormGroup;
  modalConfig: ModalConfig;
  selectedFile?: File;
  currentImageUrl?: string;
  imagePreviewUrl?: string;

  constructor(
    private fb: FormBuilder,
    private service: ArticleManagementService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [0],
      fileId: [0],
      header: ['', Validators.required],
      headerEn: ['', Validators.required],
      subHeader: ['', Validators.required],
      subHeaderEn: ['', Validators.required],
      content: ['', Validators.required],
      contentEn: ['', Validators.required],
      isDeleted: [false]
    });
  }

  openModal(id?: number): void {
    forkJoin(['NEW_RECORD', 'EDIT', 'SUBMIT', 'CANCEL'].map(key => this.translate.get(key))).subscribe(translations => {
      this.modalConfig = {
        modalTitle: id ? translations[1] : translations[0],
        dismissButtonLabel: translations[2],
        closeButtonLabel: translations[3],
        onDismiss: this.submit.bind(this),
        shouldDismiss: () => this.form.valid
      };

      this.selectedFile = undefined;
      this.currentImageUrl = undefined;
      this.imagePreviewUrl = undefined;

      if (id) {
        this.service.getById(id).subscribe(result => {
          if (result.isSuccess) {
            this.form.reset({ ...result.data });
            this.currentImageUrl = this.resolveArticleImage(result.data);
            this.imagePreviewUrl = this.currentImageUrl;
            this.modal.open({ size: 'xl', centered: true, scrollable: true });
          }
        });
        return;
      }

      this.form.reset({
        id: 0,
        fileId: 0,
        header: '',
        headerEn: '',
        subHeader: '',
        subHeaderEn: '',
        content: '',
        contentEn: '',
        isDeleted: false
      });
      this.modal.open({ size: 'xl', centered: true, scrollable: true });
    });
  }

  fileChanged(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || undefined;

    if (!this.selectedFile) {
      this.imagePreviewUrl = this.currentImageUrl;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this.imagePreviewUrl = typeof reader.result === 'string' ? reader.result : undefined;
    reader.readAsDataURL(this.selectedFile);
  }

  private resolveArticleImage(article?: ArticleModel): string | undefined {
    if (article?.fileUrl) return article.fileUrl;
    const path = article?.file?.path;
    if (!path) return undefined;
    const fileName = String(path).replace(/\\/g, '/').split('/').pop();
    return fileName ? `${environment.articleUploadFolderUrl}/${fileName}` : undefined;
  }

  submit(): boolean {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return false;
    }

    const data = this.form.getRawValue() as ArticleModel;

    if (!this.selectedFile) {
      this.saveArticle(data);
      return true;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('type', '3');

    this.service.upload(formData).subscribe({
      next: uploadResult => {
        if (!uploadResult.isSuccess) {
          this.toastr.error(uploadResult.message);
          return;
        }

        if (uploadResult.data?.id) {
          data.fileId = uploadResult.data.id;
        }

        this.saveArticle(data);
      },
      error: error => {
        this.toastr.error(error?.error?.message || 'Dosya yüklenemedi.');
      }
    });

    return true;
  }

  private saveArticle(data: ArticleModel): void {
    const request = data.id ? this.service.update(data) : this.service.save(data);

    request.subscribe({
      next: (result: ResultModel<ArticleModel>) => {
        result.isSuccess ? this.toastr.success(result.message) : this.toastr.error(result.message);
        if (result.isSuccess) {
          this.isSuccess.emit(true);
        }
      },
      error: error => {
        this.toastr.error(error?.error?.message || 'İşlem sırasında bir hata oluştu.');
      }
    });
  }
}
