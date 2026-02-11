import { AfterViewInit, Component, ElementRef, inject, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { AuthService, UserType } from '../../auth';
import { CommentComponent } from '../comment/comment.component';
import { LikeComponent } from '../like/like.component';
import { MemoryManagementService } from '../memory-management.service';
import { MemoryModel } from '../models/memory.model';
import { MemoryLikeModel } from '../models/like.model';
import { MemoryCommentModel } from '../models/comment.model';
import { MemoryFileModel } from '../models/file.model';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { CandleListComponent } from '../candle/list/list.component';
import { LightCandleComponent } from '../candle/new/new.component';
import { MemoryCandleModel } from '../models/candle.model';
import { parseBoolean } from 'src/app/utils/parse-boolean';
import { scrollToTop } from 'src/app/utils/scrolltotop';
import { ToastrService } from 'ngx-toastr';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  selector: 'app-memory-view',
  templateUrl: './memory-view.component.html',
  styleUrls: ['./memory-view.component.scss'],
})
export class MemoryViewComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  memoryId: number;
  memory: MemoryModel | undefined;

  bannerHeight?: number;
  bannerToolPaddingTopHeight?: number;
  comment: string = '';
  nameSurname: string = '';
  isCommentBoxVisible: boolean = false;
  currentUser: UserType | undefined;
  shareLink: string = '';
  isUserActive: boolean;
  
  @ViewChild('commentsComponent') private commentsComponent: CommentComponent;
  @ViewChild('likesComponent') private likesComponent: LikeComponent;
  @ViewChild('candlesComponent') private candlesComponent: CandleListComponent;
  @ViewChild('lightCandleComponent') private lightCandleComponent: LightCandleComponent;

  constructor(
    private memoryManagementService: MemoryManagementService,
    private auth: AuthService,
    private windowResizeService: WindowResizeService,
    private translate: TranslateService,
    @Inject(LOCALE_ID) public locale: string,
    private router: Router,
    private toastr: ToastrService,
  ) {
  }

  addComment() {
    let flag: boolean = false;
    if(this.currentUser) {
      if(this.isUserActive) {
        if(this.comment && this.comment != '') {
          flag = true;
        }
      }
    }
    else{
      if(this.comment && this.comment != '' && this.nameSurname && this.nameSurname != '') {
        flag = true;
      }
    }

    if (flag) {
      var data: MemoryCommentModel = { id: 0, memoryId: this.memoryId, userId: this.currentUser?.id!, comment: this.comment, nameSurname: this.nameSurname, isApproved: this.currentUser?.id == this.memory?.userId};

      this.memoryManagementService.addComment(data).subscribe(result => {
        if (result.isSuccess) {
          scrollToTop();
          this.toastr.success(this.translate.instant('SUCCESS_MESSAGE'), this.translate.instant('SUCCESS'), {
            positionClass: 'toast-top-right',
            timeOut: 3000
          });
          this.getById();
          this.comment = "";
          this.isCommentBoxVisible = false;
        }
        else {
          scrollToTop();
          this.toastr.error(result.message, this.translate.instant('ERROR'), {
            positionClass: 'toast-top-right',
            timeOut: 3000
          });
        }
      })
    }
  }

  edit() {
    this.router.navigate(["memories/edit/" + this.memoryId])
  }

  getById() {
    this.memoryManagementService.getById(this.memoryId)
      .subscribe(result => {
        if (result.isSuccess) {
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

          result.data.postDate = formatDate(result.data.postDate!, "dd/MM/yyyy HH:mm", this.locale);
          result.data.birthDate = formatDate(result.data.birthDate!, "dd/MM/yyyy", this.locale);
          result.data.deathDate = formatDate(result.data.deathDate!, "dd/MM/yyyy", this.locale);
          if(result.data.userId != this.currentUser?.id) {
            result.data.commentsCount = result.data.comments?.filter(f => f.isApproved).length!;
          }

          this.memory = result.data;
        }
        else {
          this.memory = undefined;
        }
      })
  }

  goToMemories() {
    this.router.navigate(['/memories'], {
      queryParams: {},
    });
  }

  isSuccess(event: boolean) {
    this.getById();
  }

  like() {
    if (this.currentUser && this.isUserActive) {
      if (this.memory?.ownLike) {
        this.memoryManagementService.dislike(this.currentUser?.id!, this.memoryId).subscribe(result => {
          if (result.isSuccess) {
            scrollToTop();
            this.toastr.success(this.translate.instant('SUCCESS_MESSAGE'), this.translate.instant('SUCCESS'), {
              positionClass: 'toast-top-right',
              timeOut: 3000
            });
            this.getById();
          }
          else {
            scrollToTop();
            this.toastr.error(result.message, this.translate.instant('ERROR'), {
              positionClass: 'toast-top-right',
              timeOut: 3000
            });
          }
        })
      }
      else {
        var data: MemoryLikeModel = { id: 0, memoryId: this.memoryId, userId: this.currentUser?.id!, isDeleted: false }
        this.memoryManagementService.like(data).subscribe(result => {
          if (result.isSuccess) {
            scrollToTop();
            this.toastr.success(this.translate.instant('SUCCESS_MESSAGE'), this.translate.instant('SUCCESS'), {
              positionClass: 'toast-top-right',
              timeOut: 3000
            });
            this.getById();
          }
          else {
            scrollToTop();
            this.toastr.error(result.message, this.translate.instant('ERROR'), {
              positionClass: 'toast-top-right',
              timeOut: 3000
            });
          }
        })
      }
    }
  }

  ngOnInit(): void {
    this.windowResizeService.resize$
      .subscribe(size => {
        this.bannerHeight = (size.height / 4) - document.getElementById("kt_header")?.clientHeight!;
        this.bannerToolPaddingTopHeight = this.bannerHeight / 6;
      });

    this.currentUser = this.auth.currentUserValue;
    this.isUserActive = parseBoolean(this.currentUser?.isActive);
    this.memoryId = this.route.snapshot.params['id'];

    this.shareLink = `${environment.appUrl}/#/memories/${this.memoryId}`;
    this.getById();
  }

  ngAfterViewInit(): void {

  }

  openCandlesModal(memoryId: number, candleCount: number) {
    if (candleCount > 0) {
      this.candlesComponent.openModal(memoryId);
    }
  }

  openCommentsModal(memoryId: number, commentCount: number) {
    if (commentCount > 0) {
      this.commentsComponent.openModal(this.memory!);
    }
  }

  openLightCandleModal() {
    if (this.currentUser) {
      let data: MemoryCandleModel = { id: 0, memoryId: this.memory?.id!, userId: this.currentUser?.id!, isDeleted: false };

      this.memoryManagementService.lightCandle(data).subscribe(result => {
        if (result.isSuccess) {
          this.getById();
          this.lightCandleComponent.openModal(result.data.id, this.memory?.id!, this.memory?.name!, this.currentUser?.id);
        }
      })
    }
    else {
      this.lightCandleComponent.openModal(0, this.memory?.id!, this.memory?.name!, undefined);
    }
  }

  openLikesModal(memoryId: number, likeCount: number) {
    if (likeCount > 0) {
      this.likesComponent.openModal(memoryId);
    }
  }

  showCloseCommentBox() {
    this.isCommentBoxVisible = !this.isCommentBoxVisible;
  }

  shareFacebook() {
    const url = encodeURIComponent(this.shareLink);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      '_blank',
      'width=600,height=400'
    );
  }

  shareLinkedIn() {
    const url = encodeURIComponent(this.shareLink);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank',
      'width=600,height=400'
    );
  }

  shareX() {
    var url = encodeURIComponent(this.shareLink);
    var text = encodeURIComponent('Anısı bizimle yaşıyor 🐾\n');

    window.open(
      `https://x.com/intent/tweet?url=${url}&text=${text}`,
      '_blank',
      'width=600,height=400'
    );
  }
}
