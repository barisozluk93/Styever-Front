import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { UserManagementService } from '../user-management.service';
import { RoleModel } from '../models/role.model';
import { RoleEditSaveComponent } from './edit-save/edit-save.component';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { PermissionEnum } from 'src/app/enums/permission.enum';
import { AuthService } from '../../auth';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit, OnDestroy {

  @ViewChild('editSaveComponent') private editSaveComponent: RoleEditSaveComponent;
  @ViewChild('confirmationComponent') private confirmationComponent: ConfirmationComponent;

  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  hasNewRecordPermission: boolean;

  filters: Record<string, any> = {};

  constructor(
    private userManagementService: UserManagementService, 
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  tableName: string = "";
  columnList: ColumnModel[] = [ ]
  columnListTr: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false, filterType: "number"}, 
    {name: "Adı", index: "name", visibility: true, filterType: "text"}, 
    {name: "Silindi Mi?", index: "isDeleted", visibility: true, filterType: "boolean"},  
    {name: "İşlemler", index: null, visibility: true, filterable: false}
  ]
  columnListEn: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false, filterType: "number"}, 
    {name: "Name", index: "name", visibility: true, filterType: "text"}, 
    {name: "Is Deleted?", index: "isDeleted", visibility: true, filterType: "boolean"},  
    {name: "Transactions", index: null, visibility: true, filterable: false}
  ]
  dataSource: RoleModel[];
  totalCount: number;
  paginationModel: PaginationModel;

  controlPermissions() {
    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if(result?.permissions)
      {
        let permissionList = (JSON.parse(result?.permissions) as number[]);

        if(permissionList.includes(PermissionEnum['RoleScene.Delete.Permission'])) {
          this.hasDeletePermission = true;
        }
        else{
          this.hasDeletePermission = false;
        }

        if(permissionList.includes(PermissionEnum['RoleScene.Edit.Permission'])) {
          this.hasEditPermission = true;
        }
        else{
          this.hasEditPermission = false;
        }

        if(permissionList.includes(PermissionEnum['RoleScene.Save.Permission'])) {
          this.hasNewRecordPermission = true;
        }
        else{
          this.hasNewRecordPermission = false;
        }
      }
    });
  }

  delete(event: number) {
    this.userManagementService.roleDelete(event).subscribe(result => {
      if(result.isSuccess) {
        this.toastr.success(result.message);
        this.loadData();
      }
      else{
        this.toastr.error(result.message);
      }
    })
  }

  isSuccess(event: boolean) {
    this.loadData();
  }

  loadData() {
    this.userManagementService.rolePaging(this.paginationModel.pageNumber, this.paginationModel.pageSize, this.filters)
          .subscribe(result => {
            if(result.isSuccess) {
              this.dataSource = result.data.items;
              this.totalCount = result.data.totalCount;
            }
            else{
              this.dataSource = [];
              this.totalCount = 0;
            }
          })
  }

  filtersChange(filters: Record<string, any>): void {
    this.filters = filters;
    this.paginationModel.pageNumber = 1;
    this.loadData();
  }

  ngOnInit(): void {
    this.controlPermissions();
    this.paginationModel = { pageNumber: 1, pageSize: 10 } as PaginationModel;
    this.loadData();



    this.translate.onLangChange.subscribe(() => {
      this.translate.get('ROLES').subscribe((translation: string) => {
        this.tableName = translation;
      });
      this.translate.get('LANG').subscribe((translation: string) => {
        if(translation==="tr"){
          this.columnList=this.columnListTr
        }else{
          this.columnList=this.columnListEn
        }
      });
    });

    this.translate.get('ROLES').subscribe((translation: string) => {
      this.tableName = translation;
    });
    this.translate.get('LANG').subscribe((translation: string) => {
      if(translation==="tr"){
        this.columnList=this.columnListTr
      }else{
        this.columnList=this.columnListEn
      }
    });

  }

  ngOnDestroy() {
  }

  openDeleteModal(event: number) {
    var deleteText = "";
    this.translate.get('DELETE').subscribe((translation)=> {
      deleteText = translation
    })
    this.confirmationComponent.openModal(deleteText, event);
  }

  openEditModal(event: number) {
    this.editSaveComponent.openModal(event);
  }

  openSaveModal(event: boolean) {
    this.editSaveComponent.openModal(undefined);
  }

  paginationModelChange(event: PaginationModel) {
    this.paginationModel = event;
    this.loadData();
  }

}
