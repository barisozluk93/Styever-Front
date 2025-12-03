import { AfterViewInit, Component, ElementRef, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import { LayoutInitService } from 'src/app/_metronic/layout/core/layout-init.service';
import { MemoryManagementService } from './memory-management.service';
import { PaginationModel } from 'src/app/models/pagination.model';
import { formatDate } from '@angular/common';
import { AuthService } from '../auth';
import { CategoryModel } from './models/category.model';
import { CommentComponent } from './comment/comment.component';
import { MemoryModel } from './models/memory.model';
import { LikeComponent } from './like/like.component';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss'],
})
export class MemoryComponent implements OnInit, AfterViewInit {
  dataSource: MemoryModel[];
  totalCount: number;
  paginationModel: PaginationModel;

  searchTerm: string = "";
  lastSearchTerm: string = "";
  bannerHeight?: number;
  bannerPaddingTopHeight?: number;
  bannerToolPaddingTopHeight?: number;

  selectedCategoryId: number;
  categoryList: CategoryModel[] = [
    { id: 1, name: "Kuş", nameEn: "Bird", isDeleted: false },
    { id: 2, name: "Kedi", nameEn: "Cat", isDeleted: false },
    { id: 3, name: "Köpek", nameEn: "Dog", isDeleted: false },
    { id: 4, name: "Balık", nameEn: "Fish", isDeleted: false },
    { id: 5, name: "Fare", nameEn: "Hamster", isDeleted: false },
    { id: 6, name: "At", nameEn: "Horse", isDeleted: false },
    { id: 7, name: "Kaplumbağa", nameEn: "Turtle", isDeleted: false }
  ]

  isNewMemoryVisible: boolean;

  @ViewChild('commentsComponent') private commentsComponent: CommentComponent;
  @ViewChild('likesComponent') private likesComponent: LikeComponent;

  constructor(
    private router: Router,
    private memoryManagementService: MemoryManagementService,
    private auth: AuthService,
    private windowResizeService: WindowResizeService,
    @Inject(LOCALE_ID) public locale: string) {
  }

  goToNewMemory() {
    if (this.auth.currentUserValue?.id) {
      this.router.navigate(['memories/new'], {
        queryParams: {},
      });
    }
    else {
      this.router.navigate(['/auth/registration'], {
        queryParams: {},
      });
    }
  }

  loadData() {
    this.memoryManagementService.paging(this.paginationModel.pageNumber, this.paginationModel.pageSize, this.searchTerm, this.selectedCategoryId)
      .subscribe(result => {
        if (result.isSuccess) {
          result.data.items.forEach(item => {
            
            item.files?.forEach(file => {
              if (file.isPrimary && file.fileResult) {
                item.fileResult = file.fileResult.fileContents = "data:" + file.fileResult.contentType + ";base64," + file.fileResult.fileContents;
              }
            })

            item.likes?.forEach(like => {
              if (like.userId == this.auth.currentUserValue?.id) {
                item.ownLike = true;
              }
            })

            item.postDate = formatDate(item.postDate!, "dd/MM/yyyy HH:mm", this.locale);
            item.birthDate = formatDate(item.birthDate!, "dd/MM/yyyy", this.locale);
            item.deathDate = formatDate(item.deathDate!, "dd/MM/yyyy", this.locale);

          })
          this.dataSource = result.data.items;
          this.totalCount = result.data.totalCount;
        }
        else {
          this.dataSource = [];
          this.totalCount = 0;
        }
      })
  }

  ngOnInit(): void {
    this.windowResizeService.resize$
      .subscribe(size => {
        this.bannerHeight = (size.height / 2) - document.getElementById("kt_header")?.clientHeight!;
        this.bannerPaddingTopHeight = this.bannerHeight / 4;
        this.bannerToolPaddingTopHeight = this.bannerHeight / 6;
      });

    this.paginationModel = { pageNumber: 1, pageSize: 10 } as PaginationModel;
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (this.auth.currentUserValue) {
      this.memoryManagementService.getMemoryCount(this.auth.currentUserValue?.id).subscribe(result => {
        if (result.isSuccess) {
          if (this.auth.currentUserValue?.roles.includes("2") || this.auth.currentUserValue?.roles.includes("3")) {
            if (result.data >= 1) {
              this.isNewMemoryVisible = false;
            }
            else {
              this.isNewMemoryVisible = true;
            }
          }
          else if (this.auth.currentUserValue?.roles.includes("4")) {
            if (result.data >= 4) {
              this.isNewMemoryVisible = false;
            }
            else {
              this.isNewMemoryVisible = true;
            }
          }
          else {
            this.isNewMemoryVisible = true;
          }
        }
        else{
          this.isNewMemoryVisible = true;
        }
      })
    }
    else {
      this.isNewMemoryVisible = true;
    }
  }

  openCommentsModal(memoryId: number, commentCount: number) {
    if (commentCount > 0) {
      this.commentsComponent.openModal(memoryId);
    }
  }

  openLikesModal(memoryId: number, likeCount: number) {
    if (likeCount > 0) {
      this.likesComponent.openModal(memoryId,);
    }
  }

  onPageChanges() {
    this.loadData();
  }

  onSearch() {
    if (this.searchTerm === this.lastSearchTerm) {
      return;
    }

    this.lastSearchTerm = this.searchTerm;
    this.loadData();
  }

  onPetTypeChange(event?: any) {
    this.selectedCategoryId = event.target.value;
    this.loadData();
  }

  memoryEditView(memoryId: number) {
    var memory = this.dataSource.filter(f => f.id == memoryId && f.userId == this.auth.currentUserValue?.id)[0];
    this.router.navigate(['memories/' + memoryId]);
  }
}
