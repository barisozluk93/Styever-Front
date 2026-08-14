import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DataTableComponent implements OnInit, OnDestroy {
  @Input() header: string;
  @Input() columnList: ColumnModel[] = [];
  @Input() dataSource: any[] = [];
  @Input() totalCount: number;
  @Input() paginationModel: PaginationModel;
  @Input() hasEditPermission: boolean;
  @Input() hasDeletePermission: boolean;
  @Input() hasNewRecordPermission: boolean;
  @Input() hasShowPermission: boolean = false;
  @Input() searchTerm: string = '';
  @Input() serverSideFiltering: boolean = false;

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() searchButtonClick = new EventEmitter<string>();
  @Output() filtersChange = new EventEmitter<Record<string, any>>();
  @Output() paginationModelChange = new EventEmitter<PaginationModel>();
  @Output() newButtonClick = new EventEmitter<boolean>();
  @Output() editButtonClick = new EventEmitter<number>();
  @Output() deleteButtonClick = new EventEmitter<number>();
  @Output() showButtonClick = new EventEmitter<number>();

  permissionList: number[] = [];
  filterPanelOpen = false;
  filters: Record<string, any> = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if (result?.permissions) {
        this.permissionList = JSON.parse(result.permissions) as number[];
      }
    });
  }

  ngOnDestroy(): void {}

  get filterableColumns(): ColumnModel[] {
    return (this.columnList || []).filter(column =>
      column.visibility && column.index !== null && column.filterable !== false && column.index !== 'fileResult'
    );
  }

  get activeFilterCount(): number {
    return Object.keys(this.filters).filter(key => {
      const value = this.filters[key];
      return value !== undefined && value !== null && value !== '';
    }).length;
  }

  get displayedDataSource(): any[] {
    // Management screens that opt into server-side filtering must always render
    // exactly what the backend returned. This also keeps totalCount/paging in sync.
    if (this.serverSideFiltering || !this.activeFilterCount) {
      return this.dataSource || [];
    }

    return (this.dataSource || []).filter(row =>
      this.filterableColumns.every(column => this.rowMatchesFilter(row, column))
    );
  }

  getFilterType(column: ColumnModel): string {
    if (column.filterType) {
      return column.filterType;
    }

    if (column.index === 'isDeleted') {
      return 'boolean';
    }

    return 'text';
  }

  private rowMatchesFilter(row: any, column: ColumnModel): boolean {
    const key = column.index!;
    const filterValue = this.filters[key];

    if (filterValue === undefined || filterValue === null || filterValue === '') {
      return true;
    }

    const rawValue = row?.[key];
    const type = this.getFilterType(column);

    if (type === 'boolean') {
      return String(rawValue) === String(filterValue);
    }

    if (type === 'number') {
      return Number(rawValue) === Number(filterValue);
    }

    if (type === 'date') {
      if (!rawValue) {
        return false;
      }
      const rowDate = new Date(rawValue).toISOString().slice(0, 10);
      return rowDate === filterValue;
    }

    if (type === 'select') {
      return String(rawValue) === String(filterValue);
    }

    return String(rawValue ?? '')
      .toLocaleLowerCase('tr-TR')
      .includes(String(filterValue).trim().toLocaleLowerCase('tr-TR'));
  }

  toggleFilterPanel(): void {
    this.filterPanelOpen = !this.filterPanelOpen;
  }

  clearFilters(): void {
    this.filters = {};
    if (this.serverSideFiltering) {
      this.filtersChange.emit({});
    }
  }

  applyFilters(): void {
    if (this.serverSideFiltering) {
      this.filtersChange.emit({ ...this.filters });
    }
  }

  onRowClick(id: number): void {
    this.showButtonClick.emit(id);
  }

  openDeleteModal(id: number): void {
    this.deleteButtonClick.emit(id);
  }

  openEditModal(id: number): void {
    this.editButtonClick.emit(id);
  }

  openSaveModal(): void {
    this.newButtonClick.emit(true);
  }

  onPageChanges(): void {
    this.paginationModelChange.emit(this.paginationModel);
  }

  onSearch(): void {
    this.searchTermChange.emit(this.searchTerm);
    this.searchButtonClick.emit(this.searchTerm);
  }
}
