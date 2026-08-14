import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { UserManagementService } from '../user-management.service';
import { UserEditSaveComponent } from './edit-save/edit-save.component';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { PermissionEnum } from 'src/app/enums/permission.enum';
import { AuthService } from '../../auth';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {

  @ViewChild('editSaveComponent') private editSaveComponent: UserEditSaveComponent;
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
  columnList: ColumnModel[] = []
  
  columnListTr: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false, filterType: "number"}, 
    {name: "Adı Soyadı", index: "nameSurname", visibility: true, filterType: "text"},
    {name: "Kullanıcı Adı", index: "username", visibility: true, filterType: "text"},
    {name: "E-posta", index: "email", visibility: true, filterType: "text"},  
    {name: "Telefon Numarası", index: "phone", visibility: true, filterType: "text"},
    {name: "Silindi Mi?", index: "isDeleted", visibility: true, filterType: "boolean"},
    {name: "Üyelik Aktif Mi?", index: "isActive", visibility: true, filterType: "boolean"},  
    {name: "İşlemler", index: null, visibility: true, filterable: false}
  ]

  columnListEn: ColumnModel[] = [
    {name: "Id", index: "id", visibility: false, filterType: "number"}, 
    {name: "Name Surname", index: "nameSurname", visibility: true, filterType: "text"},
    {name: "User Name", index: "username", visibility: true, filterType: "text"},
    {name: "E-mail", index: "email", visibility: true, filterType: "text"},  
    {name: "Phone Number", index: "phone", visibility: true, filterType: "text"},
    {name: "Is Deleted?", index: "isDeleted", visibility: true, filterType: "boolean"},
    {name: "Membership Active?", index: "isActive", visibility: true, filterType: "boolean"},  
    {name: "Transactions", index: null, visibility: true, filterable: false}
  ]

  dataSource: UserModel[];
  totalCount: number;
  paginationModel: PaginationModel;

  controlPermissions() {
    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if(result?.permissions)
      {
        let permissionList = (JSON.parse(result?.permissions) as number[]);

        if(permissionList.includes(PermissionEnum['UserScene.Delete.Permission'])) {
          this.hasDeletePermission = true;
        }
        else{
          this.hasDeletePermission = false;
        }

        if(permissionList.includes(PermissionEnum['UserScene.Edit.Permission'])) {
          this.hasEditPermission = true;
        }
        else{
          this.hasEditPermission = false;
        }

        if(permissionList.includes(PermissionEnum['UserScene.Save.Permission'])) {
          this.hasNewRecordPermission = true;
        }
        else{
          this.hasNewRecordPermission = false;
        }
      }
    });
  }
  
  delete(event: number) {
    this.userManagementService.userDelete(event).subscribe(result => {
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
    this.userManagementService.userPaging(this.paginationModel.pageNumber, this.paginationModel.pageSize, this.filters)
          .subscribe(result => {
            if(result.isSuccess) {
              result.data.items.forEach(item => {
                item.nameSurname = item.name + " " + item.surname;
              })

              this.dataSource = result.data.items;
              this.totalCount = result.data.totalCount;
            }
            else{
              this.dataSource = [];
              this.totalCount = 0;
            }
          })
  }

  ngOnInit(): void {
    this.controlPermissions();
    this.paginationModel = { pageNumber: 1, pageSize: 10 } as PaginationModel;
    this.loadData();

    this.translate.onLangChange.subscribe(() => {
      this.translate.get("USERS").subscribe((translation)=> {
        this.tableName = translation
      })

      this.translate.get('LANG').subscribe((translation: string) => {
        if(translation==="tr"){
          this.columnList=this.columnListTr
        }else{
          this.columnList=this.columnListEn
        }
      });
    });

    this.translate.get("USERS").subscribe((translation)=> {
      this.tableName = translation
    })
    
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

  filtersChange(filters: Record<string, any>): void {
    this.filters = filters;
    this.paginationModel.pageNumber = 1;
    this.loadData();
  }
}
