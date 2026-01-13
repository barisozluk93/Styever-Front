import { AfterViewInit, Component, ElementRef, inject, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { AuthService, UserType } from '../../auth';
import { ArticleManagementService } from '../article-management.service';
import { environment } from 'src/environments/environment';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.scss'],
})
export class ArticleViewComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  articleId: number;
  article: any | undefined;
  
  bannerHeight?: number;
  bannerPaddingTopHeight?: number;
  bannerToolPaddingTopHeight?: number;

  constructor(
    private articleManagementService: ArticleManagementService,
    private auth: AuthService,
    private windowResizeService: WindowResizeService,
    @Inject(LOCALE_ID) public locale: string,
    private router: Router) {
  }

  getById() {
    this.articleManagementService.getById(this.articleId)
      .subscribe(result => {
        if (result.isSuccess) {
          result.data.fileUrl = environment.articleUploadFolderUrl + "/" + result.data.file?.path.split("\\")[result.data.file?.path.split("\\").length-1];
          this.article = result.data;
        }
        else {
          this.article = undefined;
        }
      })
  }

  goToArticles() {
    this.router.navigate(['/support'], {
      queryParams: {},
    });
  }


  ngOnInit(): void {
    this.windowResizeService.resize$
      .subscribe(size => {
        this.bannerHeight = (size.height / 2) - document.getElementById("kt_header")?.clientHeight!;
        this.bannerPaddingTopHeight = this.bannerHeight / 4;
        this.bannerToolPaddingTopHeight = this.bannerHeight / 6 ;
      });
    
    this.articleId = this.route.snapshot.params['id'];
    this.getById();
  }

  ngAfterViewInit(): void {

  }
}
