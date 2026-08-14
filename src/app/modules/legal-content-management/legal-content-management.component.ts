import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { LegalContentModel, LegalContentService } from '../common/legal-content/legal-content.service';
import { LegalContentEditSaveComponent } from './edit-save/edit-save.component';

@Component({
  selector: 'app-legal-content-management',
  templateUrl: './legal-content-management.component.html',
  styleUrls: ['./legal-content-management.component.scss']
})
export class LegalContentManagementComponent implements OnInit {
  @ViewChild('editSaveComponent') editSaveComponent: LegalContentEditSaveComponent;
  @ViewChild('confirmationComponent') confirmationComponent: ConfirmationComponent;

  tableName = '';
  dataSource: LegalContentModel[] = [];
  totalCount = 0;
  paginationModel: PaginationModel = { pageNumber: 1, pageSize: 10 } as PaginationModel;
  filters: Record<string, any> = {};
  columnList: ColumnModel[] = [];

  readonly columnsTr: ColumnModel[] = [
    { name: 'Id', index: 'id', visibility: false, filterType: 'number' },
    {
      name: 'Kategori',
      index: 'category',
      visibility: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Legal', value: 'Legal' },
        { label: 'Community', value: 'Community' }
      ]
    },
    { name: 'Başlık', index: 'title', visibility: true, filterType: 'text' },
    { name: 'İngilizce Başlık', index: 'titleEn', visibility: true, filterType: 'text' },
    { name: 'Slug', index: 'slug', visibility: true, filterType: 'text' },
    { name: 'Sıra', index: 'sortOrder', visibility: true, filterType: 'number' },
    { name: 'Silindi Mi?', index: 'isDeleted', visibility: true, filterType: 'boolean' },
    { name: 'İşlemler', index: null, visibility: true, filterable: false }
  ];

  readonly columnsEn: ColumnModel[] = [
    { name: 'Id', index: 'id', visibility: false, filterType: 'number' },
    {
      name: 'Category',
      index: 'category',
      visibility: true,
      filterType: 'select',
      filterOptions: [
        { label: 'Legal', value: 'Legal' },
        { label: 'Community', value: 'Community' }
      ]
    },
    { name: 'Title', index: 'title', visibility: true, filterType: 'text' },
    { name: 'English Title', index: 'titleEn', visibility: true, filterType: 'text' },
    { name: 'Slug', index: 'slug', visibility: true, filterType: 'text' },
    { name: 'Order', index: 'sortOrder', visibility: true, filterType: 'number' },
    { name: 'Is Deleted?', index: 'isDeleted', visibility: true, filterType: 'boolean' },
    { name: 'Actions', index: null, visibility: true, filterable: false }
  ];

  constructor(
    private service: LegalContentService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.setLanguage();
    this.translate.onLangChange.subscribe(() => this.setLanguage());
    this.loadData();
  }

  private setLanguage(): void {
    this.translate.get('LANG').subscribe(lang => {
      this.columnList = lang === 'tr' ? this.columnsTr : this.columnsEn;
    });
    this.translate.get('ADMIN_LEGAL_CONTENT.TITLE').subscribe(value => {
      this.tableName = value;
    });
  }

  loadData(): void {
    this.service.paginate(this.paginationModel.pageNumber, this.paginationModel.pageSize, this.filters).subscribe({
      next: result => {
        if (!result?.isSuccess) {
          this.dataSource = [];
          this.totalCount = 0;
          this.toastr.error(result?.message || 'İçerikler yüklenemedi.');
          return;
        }

        this.dataSource = result.data?.items || [];
        this.totalCount = result.data?.totalCount || 0;
      },
      error: error => {
        this.dataSource = [];
        this.totalCount = 0;
        this.toastr.error(error?.error?.message || 'İçerik servisine ulaşılamadı.');
      }
    });
  }

  paginationModelChange(event: PaginationModel): void {
    this.paginationModel = event;
    this.loadData();
  }

  filtersChange(filters: Record<string, any>): void {
    this.filters = filters || {};
    this.paginationModel.pageNumber = 1;
    this.loadData();
  }

  openSaveModal(): void {
    this.editSaveComponent.openModal();
  }

  openEditModal(id: number): void {
    const item = this.dataSource.find(x => x.id === id);
    if (item) this.editSaveComponent.openModal(item);
  }

  openDeleteModal(id: number): void {
    this.translate.get('DELETE').subscribe(text => this.confirmationComponent.openModal(text, id));
  }

  delete(id: any): void {
    this.service.delete(id).subscribe({
      next: result => {
        result?.isSuccess ? this.toastr.success(result.message) : this.toastr.error(result?.message);
        if (result?.isSuccess) this.loadData();
      },
      error: error => this.toastr.error(error?.error?.message || 'İşlem başarısız.')
    });
  }
}
