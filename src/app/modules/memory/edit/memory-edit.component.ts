import { AfterViewInit, Component, ElementRef, inject, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationModel } from 'src/app/models/pagination.model';
import { formatDate } from '@angular/common';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { AuthService, UserType } from '../../auth';
import { CommentComponent } from '../comment/comment.component';
import { LikeComponent } from '../like/like.component';
import { MemoryManagementService } from '../memory-management.service';
import { CategoryModel } from '../models/category.model';
import { MemoryModel } from '../models/memory.model';
import { MemoryLikeModel } from '../models/like.model';
import { AuthModel } from '../../auth/models/auth.model';
import { MemoryCommentModel } from '../models/comment.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemoryFileModel } from '../models/file.model';
import { environment } from 'src/environments/environment';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  selector: 'app-memory-edit',
  templateUrl: './memory-edit.component.html',
  styleUrls: ['./memory-edit.component.scss'],
})
export class MemoryEditComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  memoryId: number;
  isImageUploadAllowed: boolean = true;
  isVideoUploadAllowed: boolean = false;
  form: FormGroup;
  mediaFiles: MemoryFileModel[] = [];
  activeMediaIndex: number = 0;

  bannerHeight?: number;
  bannerToolPaddingTopHeight?: number;
  currentUser: UserType | undefined;

  categoryList: CategoryModel[] = [
    { id: 1, name: "Kuş", nameEn: "Bird", isDeleted: false },
    { id: 2, name: "Kedi", nameEn: "Cat", isDeleted: false },
    { id: 3, name: "Köpek", nameEn: "Dog", isDeleted: false },
    { id: 4, name: "Balık", nameEn: "Fish", isDeleted: false },
    { id: 5, name: "Fare", nameEn: "Hamster", isDeleted: false },
    { id: 6, name: "At", nameEn: "Horse", isDeleted: false },
    { id: 7, name: "Kaplumbağa", nameEn: "Turtle", isDeleted: false }
  ]

  constructor(
    private memoryManagementService: MemoryManagementService,
    private auth: AuthService,
    private windowResizeService: WindowResizeService,
    private fb: FormBuilder,
    @Inject(LOCALE_ID) public locale: string,
    private router: Router) {
  }


  getById(file?: any) {
    this.memoryManagementService.getById(this.memoryId)
      .subscribe(result => {
        if (result.isSuccess) {
          if (this.mediaFiles.filter(f => f.file?.contentType.includes("image")).length == 0) {
            this.form.get("fileUrl")?.patchValue(undefined);
          }

          if (this.currentUser?.roles.includes("2")) {
            this.isVideoUploadAllowed = false;

            if (this.mediaFiles.filter(f => f.file?.contentType.includes("image")).length >= 1) {
              this.isImageUploadAllowed = false;
            }
            else {
              this.isImageUploadAllowed = true;
            }

          }
          else if (this.currentUser?.roles.includes("3")) {
            if (this.mediaFiles.filter(f => f.file?.contentType.includes("image")).length >= 4) {
              this.isImageUploadAllowed = false;
            }
            else {
              this.isImageUploadAllowed = true;
            }

            if (this.mediaFiles.filter(f => !f.file?.contentType.includes("image")).length == 2) {
              this.isVideoUploadAllowed = false;
            }
            else {
              this.isVideoUploadAllowed = true;
            }
          }
          else if (this.currentUser?.roles.includes("4")) {
            if (this.mediaFiles.filter(f => f.file?.contentType.includes("image")).length >= 2) {
              this.isImageUploadAllowed = false;
            }
            else {
              this.isImageUploadAllowed = true;
            }

            if (this.mediaFiles.filter(f => !f.file?.contentType.includes("image")).length == 1) {
              this.isVideoUploadAllowed = false;
            }
            else {
              this.isVideoUploadAllowed = true;
            }
          }
          else {
            this.isImageUploadAllowed = true;
            this.isVideoUploadAllowed = true;
          }

          result.data.files?.forEach(file => {
            if (file.file) {
              file.fileUrl = environment.memoryUploadFolderUrl + "/" + file.file?.path.split("\\")[file.file?.path.split("\\").length - 1];

              if (file.isPrimary) {
                result.data.fileUrl = file.fileUrl;
              }
            }
          })

          result.data.likes?.forEach(like => {
            if (like.userId == this.currentUser?.id) {
              result.data.ownLike = true;
            }
          })

          result.data.categoryName = result.data.category?.name;
          result.data.postDateStr = formatDate(result.data.postDate!, "dd.MM.yyyy HH:mm", this.locale);
          result.data.birthDate = formatDate(result.data.birthDate!, "YYYY-MM-dd", this.locale);
          result.data.birthDateStr = formatDate(result.data.birthDate!, "dd.MM.yyyy", this.locale);
          result.data.deathDateStr = formatDate(result.data.deathDate!, "dd.MM.yyyy", this.locale);

          result.data.files?.forEach(file => {
            if (file.isPrimary && file.file) {
              result.data.fileUrl = environment.memoryUploadFolderUrl + "/" + file.file?.path.split("\\")[file.file?.path.split("\\").length - 1];
            }
          })

          result.data?.files!.sort((a, b) => {
            const aIsImage = a.file?.contentType?.includes('image') ? 1 : 0;
            const bIsImage = b.file?.contentType?.includes('image') ? 1 : 0;

            const aIsPrimary = a.isPrimary ? 1 : 0;
            const bIsPrimary = b.isPrimary ? 1 : 0;

            if (aIsPrimary !== bIsPrimary) {
              return bIsPrimary - aIsPrimary;
            }

            if (aIsImage !== bIsImage) {
              return bIsImage - aIsImage;
            }

            return 0;
          });
          this.mediaFiles = result.data?.files!;

          if (file && !file.type.includes("image")) {
            this.activeMediaIndex = this.mediaFiles.length - 1;
          }
          else if (file && file.type.includes("image")) {
            this.activeMediaIndex = this.mediaFiles.filter(f => f.file?.contentType.includes('image')).length-1;
          }

          this.form.patchValue(result.data);
        }
      })
  }

  goToMemories() {
    this.router.navigate(['/memories'], {
      queryParams: {},
    });
  }

  disableSubmitButton(): boolean {
    return this.form.invalid;
  }

  get f() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.fb.group({
      id: 0,
      userId: this.currentUser?.id,
      fileUrl: undefined,
      userName: '',
      postDateStr: '',
      birthDateStr: '',
      deathDateStr: '',
      categoryName: '',
      categoryId: [
        "",
        Validators.compose([
          Validators.required,
        ]),
      ],
      name: [
        "",
        Validators.compose([
          Validators.required,
        ]),
      ],
      text: [
        "",
        Validators.compose([
          Validators.required,
        ]),
      ],
      birthDate: [
        undefined,
        Validators.compose([
          Validators.required,
        ]),
      ],
      deathDate: [
        undefined,
        Validators.compose([
          Validators.required,
        ]),
      ],
      isOpenToComment: [
        false,
        Validators.compose([
          Validators.required,
        ]),
      ],
      isPrivate: [
        false,
        Validators.compose([
          Validators.required,
        ]),
      ],
      isLinkOnly: [
        false,
        Validators.compose([
          Validators.required,
        ]),
      ],
      isDeleted: false,
      belongToOldPackage: false
    });
  }

  ngOnInit(): void {
    this.windowResizeService.resize$
      .subscribe(size => {
        this.bannerHeight = (size.height / 4) - document.getElementById("kt_header")?.clientHeight!;
        this.bannerToolPaddingTopHeight = this.bannerHeight / 6;
      });

    this.initForm();
    this.currentUser = this.auth.currentUserValue;
    this.memoryId = this.route.snapshot.params['id'];

    if (this.memoryId) {
      this.getById(undefined);
    }
    else {
      this.form.get("userName")?.patchValue(this.currentUser?.name + " " + this.currentUser?.surname);
      this.form.get("postDateStr")?.patchValue(formatDate(new Date(), 'dd.MM.yyyy', this.locale));
    }
  }

  ngAfterViewInit(): void {
    this.form.get('categoryId')?.valueChanges.subscribe(result => {
      this.form.get("categoryName")?.patchValue(this.categoryList.filter(f => f.id == result)[0]?.name);
    })

    this.form.get('birthDate')?.valueChanges.subscribe(result => {
      this.form.get("birthDateStr")?.patchValue(formatDate(result, "dd.MM.yyyy", this.locale));
    })

    this.form.get('deathDate')?.valueChanges.subscribe(result => {
      this.form.get("deathDateStr")?.patchValue(formatDate(result, "dd.MM.yyyy", this.locale));
    })

    this.form.get('isPrivate')?.valueChanges.subscribe(result => {
      if(result == true) {
        this.form.get("isLinkOnly")?.disable();
        this.form.get("isOpenToComment")?.patchValue(false);
        this.form.get("isOpenToComment")?.disable();
      }
      else if(result == false) {
        this.form.get("isLinkOnly")?.enable();
        this.form.get("isOpenToComment")?.patchValue(false);
        this.form.get("isOpenToComment")?.enable();
      }
    })

    this.form.get('isLinkOnly')?.valueChanges.subscribe(result => {
      if(result == true) {
        this.form.get("isPrivate")?.disable();
        this.form.get("isOpenToComment")?.patchValue(false);
        this.form.get("isOpenToComment")?.disable();
      }
      else if(result == false) {
        this.form.get("isPrivate")?.enable();
        this.form.get("isOpenToComment")?.patchValue(false);
        this.form.get("isOpenToComment")?.enable();
      }
    })
  }

  onCheckboxClicked(fileId: number) {
    this.memoryManagementService.setMemoryFileIsPrimary(fileId).subscribe(result => {
      if (result.isSuccess) {
        this.getById(undefined);
        this.activeMediaIndex = 0;
      }
    })
  }

  onFileChange(event: any) {

    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let formData = new FormData();

      formData.append("file", file);
      formData.append("type", "2");

      this.memoryManagementService.upload(formData).subscribe(result => {
        if (result.isSuccess) {
          var data: MemoryFileModel = { id: 0, memoryId: this.memoryId, fileId: result.data.id, isPrimary: this.mediaFiles.filter(f => f.file?.contentType.includes("image")).length > 0 ? false : true };
          this.memoryManagementService.memoryFileAdd(data).subscribe(result => {
            if (result.isSuccess) {
              // this.alertService.createAlert("success", result.message);
              this.getById(file);
            }
            else {
              // this.alertService.createAlert("danger", result.message);
            }
          })
        }
        else {
          // this.alertService.createAlert("danger", result.message);
        }
      })
    }
  }

  submit() {
    var data: MemoryModel = this.form.getRawValue();

    if (this.memoryId > 0) {
      this.memoryManagementService.edit(data).subscribe(result => {
        if (result.isSuccess) {
          this.getById(undefined);
        }
      })
    }
    else {
      data.userId = this.currentUser?.id!;
      this.memoryManagementService.save(data).subscribe(result => {
        if (result.isSuccess) {
          this.memoryId = result.data.id;
          this.getById(undefined);
        }
      })
    }
  }

  deleteFile(fileId: number, memoryFileId: number) {
    this.memoryManagementService.deleteFile(fileId).subscribe(result => {
      if (result.isSuccess) {
        this.memoryManagementService.memoryFileDelete(memoryFileId).subscribe(result => {
          if (result.isSuccess) {
            this.getById(undefined);

            if ((this.mediaFiles.length - 1) == 1 || (this.mediaFiles.length - 1) == 0) {
              this.activeMediaIndex = 0;
            }
            else {
              if (this.mediaFiles.length - 1 == this.activeMediaIndex) {
                this.activeMediaIndex = this.activeMediaIndex - 1;
              }
            }
          }
        })
      }
    })
  }

  isFileDeleted(event: number) {
    let file = this.mediaFiles[event];
    this.deleteFile(file.fileId, file.id);
  }

  isCheckboxClicked(event: number) {
    let file = this.mediaFiles[event];
    this.onCheckboxClicked(file.id);
  }

  onActiveMediaIndexChanged(event: number) {
    this.activeMediaIndex = event;
  }
}
