import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { ArticleManagementService } from '../article/article-management.service';
import { ArticleModel } from '../article/models/article.model';
import { AuthService } from '../auth';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { SupportEditSaveComponent } from './edit-save/edit-save.component';

@Component({ selector: 'app-support-management', templateUrl: './support-management.component.html', styleUrls: ['./support-management.component.scss'] })
export class SupportManagementComponent implements OnInit {
  @ViewChild('editSaveComponent') editSaveComponent: SupportEditSaveComponent;
  @ViewChild('confirmationComponent') confirmationComponent: ConfirmationComponent;
  tableName = '';
  dataSource: ArticleModel[] = [];
  totalCount = 0;
  paginationModel: PaginationModel = { pageNumber: 1, pageSize: 10 } as PaginationModel;
  hasPermission = false;
  filters: Record<string, any> = {};
  columnList: ColumnModel[] = [];
  readonly columnsTr: ColumnModel[] = [
    { name: 'Id', index: 'id', visibility: false, filterType: 'number' },
    { name: 'Başlık', index: 'header', visibility: true, filterType: 'text' },
    { name: 'İngilizce Başlık', index: 'headerEn', visibility: true, filterType: 'text' },
    { name: 'Alt Başlık', index: 'subHeader', visibility: true, filterType: 'text' },
    { name: 'Silindi Mi?', index: 'isDeleted', visibility: true, filterType: 'boolean' },
    { name: 'İşlemler', index: null, visibility: true, filterable: false }
  ];
  readonly columnsEn: ColumnModel[] = [
    { name: 'Id', index: 'id', visibility: false, filterType: 'number' },
    { name: 'Title', index: 'header', visibility: true, filterType: 'text' },
    { name: 'English Title', index: 'headerEn', visibility: true, filterType: 'text' },
    { name: 'Subtitle', index: 'subHeader', visibility: true, filterType: 'text' },
    { name: 'Is Deleted?', index: 'isDeleted', visibility: true, filterType: 'boolean' },
    { name: 'Actions', index: null, visibility: true, filterable: false }
  ];

  constructor(private service: ArticleManagementService, private auth: AuthService, private toastr: ToastrService, private translate: TranslateService) {}
  ngOnInit(): void {
    this.setLanguage();
    this.translate.onLangChange.subscribe(() => this.setLanguage());
    this.auth.currentUserSubject.subscribe(user => {
      try { this.hasPermission = !!user?.permissions && (JSON.parse(user.permissions) as number[]).includes(44); } catch { this.hasPermission = false; }
    });
    this.loadData();
  }
  private setLanguage(): void {
    this.translate.get('LANG').subscribe(lang => this.columnList = lang === 'tr' ? this.columnsTr : this.columnsEn);
    this.translate.get('ADMIN_SUPPORT.TITLE').subscribe(value => this.tableName = value);
  }
  loadData(): void {
    this.service.paginate(this.paginationModel.pageNumber, this.paginationModel.pageSize, this.filters).subscribe(result => {
      this.dataSource = result?.isSuccess ? result.data.items : [];
      this.totalCount = result?.isSuccess ? result.data.totalCount : 0;
    });
  }
  paginationModelChange(event: PaginationModel): void { this.paginationModel = event; this.loadData(); }
  filtersChange(filters: Record<string, any>): void { this.filters = filters; this.paginationModel.pageNumber = 1; this.loadData(); }
  openSaveModal(): void { this.editSaveComponent.openModal(); }
  openEditModal(id: number): void { this.editSaveComponent.openModal(id); }
  openDeleteModal(id: number): void { this.translate.get('DELETE').subscribe(text => this.confirmationComponent.openModal(text, id)); }
  delete(id: number): void { this.service.delete(id).subscribe(result => { result.isSuccess ? this.toastr.success(result.message) : this.toastr.error(result.message); if (result.isSuccess) this.loadData(); }); }
}
