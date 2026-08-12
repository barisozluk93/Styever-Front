import {
  AfterViewInit,
  Component,
  Inject,
  LOCALE_ID,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
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
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { CandleListComponent } from '../candle/list/list.component';
import { LightCandleComponent } from '../candle/new/new.component';
import { MemoryCandleModel } from '../models/candle.model';
import { parseBoolean } from 'src/app/utils/parse-boolean';
import { scrollToTop } from 'src/app/utils/scrolltotop';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

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

  isShareModalOpen: boolean = false;

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
  ) { }

  ngOnInit(): void {
    this.windowResizeService.resize$
      .subscribe(size => {
        this.bannerHeight =
          (size.height / 4) - document.getElementById('kt_header')?.clientHeight!;
        this.bannerToolPaddingTopHeight = this.bannerHeight / 6;
      });

    this.currentUser = this.auth.currentUserValue;
    this.isUserActive = parseBoolean(this.currentUser?.isActive);
    this.memoryId = this.route.snapshot.params['id'];

    this.shareLink = `${environment.appUrl}/#/memories/${this.memoryId}`;
    this.getById();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const popoverTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="popover"]')
      );

      popoverTriggerList.map((popoverTriggerEl: any) => {
        return new bootstrap.Popover(popoverTriggerEl);
      });
    }, 300);
  }

  addComment(): void {
    let flag: boolean = false;

    if (this.currentUser) {
      if (this.isUserActive) {
        if (this.comment && this.comment !== '') {
          flag = true;
        }
      }
    } else {
      if (
        this.comment &&
        this.comment !== '' &&
        this.nameSurname &&
        this.nameSurname !== ''
      ) {
        flag = true;
      }
    }

    if (flag) {
      const data: MemoryCommentModel = {
        id: 0,
        memoryId: this.memoryId,
        userId: this.currentUser?.id!,
        comment: this.comment,
        nameSurname: this.nameSurname,
        isApproved: this.currentUser?.id == this.memory?.userId
      };

      this.memoryManagementService.addComment(data).subscribe(result => {
        if (result.isSuccess) {
          scrollToTop();
          this.toastr.success(
            this.translate.instant('COMMENT_ADDED_SUCCESS'),
            this.translate.instant('SUCCESS'),
            {
              positionClass: 'toast-top-center',
              timeOut: 3000
            }
          );
          this.getById();
          this.nameSurname = '';
          this.comment = '';
          this.isCommentBoxVisible = false;
        } else {
          scrollToTop();
          this.toastr.error(
            result.message,
            this.translate.instant('ERROR'),
            {
              positionClass: 'toast-top-center',
              timeOut: 3000
            }
          );
        }
      });
    }
  }

  edit(): void {
    this.router.navigate(['memories/edit/' + this.memoryId]);
  }

  getById(): void {
    this.memoryManagementService.getById(this.memoryId)
      .subscribe(result => {
        if (result.isSuccess) {
          result.data.files?.forEach(file => {
            if (file.file) {
              file.fileUrl =
                environment.memoryUploadFolderUrl +
                '/' +
                file.file?.path.split('\\')[file.file?.path.split('\\').length - 1];

              if (file.isPrimary) {
                result.data.fileUrl = file.fileUrl;
              }
            }
          });

          if (result.data.userAvatar) {
            const avatarPath = result.data.userAvatar.path || '';
            const avatarFileName = avatarPath.split('\\').pop()?.split('/').pop();
            if (avatarFileName) {
              result.data.userAvatarFileUrl = environment.avatarUploadFolderUrl + '/' + avatarFileName;
            }
          }

          result.data.likes?.forEach(like => {
            if (like.userId == this.currentUser?.id) {
              result.data.ownLike = true;
            }
          });

          result.data.postDate = formatDate(
            result.data.postDate!,
            'dd/MM/yyyy HH:mm',
            this.locale
          );
          result.data.birthDate = formatDate(
            result.data.birthDate!,
            'dd/MM/yyyy',
            this.locale
          );
          result.data.deathDate = formatDate(
            result.data.deathDate!,
            'dd/MM/yyyy',
            this.locale
          );

          if (result.data.userId != this.currentUser?.id) {
            result.data.commentsCount =
              result.data.comments?.filter(f => f.isApproved).length!;
          }

          this.memory = result.data;
        } else {
          this.memory = undefined;
        }
      });
  }

  goToContent(): void {
    document.getElementById('memory-view-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  goToMemories(): void {
    this.router.navigate(['/memories'], {
      queryParams: {},
    });
  }

  isSuccess(event: boolean): void {
    this.getById();
  }

  like(): void {
    if (this.currentUser && this.isUserActive) {
      if (this.memory?.ownLike) {
        this.memoryManagementService
          .dislike(this.currentUser?.id!, this.memoryId)
          .subscribe(result => {
            if (result.isSuccess) {
              scrollToTop();
              this.toastr.success(
                this.translate.instant('LIKE_REMOVED_SUCCESS'),
                this.translate.instant('SUCCESS'),
                {
                  positionClass: 'toast-top-center',
                  timeOut: 3000
                }
              );
              this.getById();
            } else {
              scrollToTop();
              this.toastr.error(
                result.message,
                this.translate.instant('ERROR'),
                {
                  positionClass: 'toast-top-center',
                  timeOut: 3000
                }
              );
            }
          });
      } else {
        const data: MemoryLikeModel = {
          id: 0,
          memoryId: this.memoryId,
          userId: this.currentUser?.id!,
          isDeleted: false
        };

        this.memoryManagementService.like(data).subscribe(result => {
          if (result.isSuccess) {
            scrollToTop();
            this.toastr.success(
              this.translate.instant('LIKE_ADDED_SUCCESS'),
              this.translate.instant('SUCCESS'),
              {
                positionClass: 'toast-top-center',
                timeOut: 3000
              }
            );
            this.getById();
          } else {
            scrollToTop();
            this.toastr.error(
              result.message,
              this.translate.instant('ERROR'),
              {
                positionClass: 'toast-top-center',
                timeOut: 3000
              }
            );
          }
        });
      }
    }
  }

  openCandlesModal(memoryId: number, candleCount: number): void {
    if (candleCount > 0) {
      this.candlesComponent.openModal(memoryId);
    }
  }

  openCommentsModal(memoryId: number, commentCount: number): void {
    if (commentCount > 0) {
      this.commentsComponent.openModal(this.memory!);
    }
  }

  openLightCandleModal(): void {
    if (this.currentUser) {
      const data: MemoryCandleModel = {
        id: 0,
        memoryId: this.memory?.id!,
        userId: this.currentUser?.id!,
        isDeleted: false
      };

      this.memoryManagementService.lightCandle(data).subscribe(result => {
        if (result.isSuccess) {
          this.getById();
          this.lightCandleComponent.openModal(
            result.data.id,
            this.memory?.id!,
            this.memory?.name!,
            this.currentUser?.id
          );
        }
      });
    } else {
      this.lightCandleComponent.openModal(
        0,
        this.memory?.id!,
        this.memory?.name!,
        undefined
      );
    }
  }

  openLikesModal(memoryId: number, likeCount: number): void {
    if (likeCount > 0) {
      this.likesComponent.openModal(memoryId);
    }
  }

  showCloseCommentBox(): void {
    this.isCommentBoxVisible = !this.isCommentBoxVisible;
  }

  openShareModal(): void {
    this.prepareShareLink();
    this.isShareModalOpen = true;
  }

  closeShareModal(): void {
    this.isShareModalOpen = false;
  }

  prepareShareLink(): void {
    if (!this.shareLink || this.shareLink.trim() === '') {
      this.shareLink = `${environment.appUrl}/#/memories/${this.memoryId}`;
    }
  }

  shareFacebook(): void {
    this.prepareShareLink();
    const url = encodeURIComponent(this.shareLink);

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      '_blank',
      'width=600,height=400'
    );
  }

  shareLinkedIn(): void {
    this.prepareShareLink();
    const url = encodeURIComponent(this.shareLink);

    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank',
      'width=600,height=400'
    );
  }

  shareX(): void {
    this.prepareShareLink();
    const url = encodeURIComponent(this.shareLink);
    const text = encodeURIComponent('Anısı bizimle yaşıyor 🐾\n');

    window.open(
      `https://x.com/intent/tweet?url=${url}&text=${text}`,
      '_blank',
      'width=600,height=400'
    );
  }

  shareWhatsApp(): void {
    this.prepareShareLink();

    const url = encodeURIComponent(this.shareLink);
    const text = encodeURIComponent('Anısı bizimle yaşıyor 🐾');

    window.open(
      `https://wa.me/?text=${text}%20${url}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  shareFacebookFromModal(): void {
    this.shareFacebook();
  }

  shareLinkedInFromModal(): void {
    this.shareLinkedIn();
  }

  shareXFromModal(): void {
    this.shareX();
  }

  copyShareLink(): void {
    this.prepareShareLink();

    navigator.clipboard.writeText(this.shareLink).then(() => {
      this.toastr.success(
        this.translate.instant('LINK_COPIED'),
        this.translate.instant('SUCCESS'),
        {
          positionClass: 'toast-top-center',
          timeOut: 3000
        }
      );
    }).catch(() => {
      const input = document.createElement('input');
      input.value = this.shareLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);

      this.toastr.success(
        this.translate.instant('LINK_COPIED'),
        this.translate.instant('SUCCESS'),
        {
          positionClass: 'toast-top-center',
          timeOut: 3000
        }
      );
    });
  }

  reportMemory(): void {
    this.prepareShareLink();

    this.router.navigate(['/report-content'], {
      queryParams: {
        pagedLink: this.shareLink
      }
    });
  }
}