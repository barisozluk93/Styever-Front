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
  isCommentBoxVisible: boolean = false;
  currentUser: UserType | undefined;
  shareLink: string = '';

  @ViewChild('commentsComponent') private commentsComponent: CommentComponent;
  @ViewChild('likesComponent') private likesComponent: LikeComponent;

  constructor(
    private memoryManagementService: MemoryManagementService,
    private auth: AuthService,
    private windowResizeService: WindowResizeService,
    private translate: TranslateService,
    @Inject(LOCALE_ID) public locale: string,
    private router: Router) {
  }

  addComment() {
    var data: MemoryCommentModel = { id: 0, memoryId: this.memoryId, userId: this.currentUser?.id!, comment: this.comment };

    this.memoryManagementService.addComment(data).subscribe(result => {
      if (result.isSuccess) {
        this.getById();
        this.comment = "";
        this.isCommentBoxVisible = false;
      }
    })
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
    if (this.memory?.ownLike) {
      this.memoryManagementService.dislike(this.currentUser?.id!, this.memoryId).subscribe(result => {
        if (result.isSuccess) {
          this.getById();
        }
      })
    }
    else {
      var data: MemoryLikeModel = { id: 0, memoryId: this.memoryId, userId: this.currentUser?.id!, isDeleted: false }
      this.memoryManagementService.like(data).subscribe(result => {
        if (result.isSuccess) {
          this.getById();
        }
      })
    }
  }

  ngOnInit(): void {
    this.windowResizeService.resize$
      .subscribe(size => {
        this.bannerHeight = (size.height / 4) - document.getElementById("kt_header")?.clientHeight!;
        this.bannerToolPaddingTopHeight = this.bannerHeight / 6;
      });

    this.currentUser = this.auth.currentUserValue;
    this.memoryId = this.route.snapshot.params['id'];

    this.shareLink = `${environment.appUrl}/#/memories/${this.memoryId}`;
    this.getById();
  }

  ngAfterViewInit(): void {

  }

  openCommentsModal(memoryId: number, commentCount: number) {
    if (commentCount > 0) {
      this.commentsComponent.openModal(memoryId);
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
    var text = '';
    if(this.translate.currentLang == 'tr') {
      text = encodeURIComponent('Can dostum, ' + this.memory?.name + ' ile olan anılarımı sen de paylaş!\n');
    }
    else{
      text = encodeURIComponent('Join me in sharing memories with my best friend ' + this.memory?.name + '!\n');
    }
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      '_blank',
      'width=600,height=400'
    );
  }
}
