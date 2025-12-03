import { AfterViewInit, Component, ElementRef, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { AuthService } from '../auth';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { ArticleManagementService } from './article-management.service';
import { ArticleModel } from './models/article.model';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit, AfterViewInit {
  dataSource: ArticleModel[] = [];

  bannerHeight?: number;
  bannerPaddingTopHeight?: number;
  bannerToolPaddingTopHeight?: number;

  searchTerm: string = "";
  lastSearchTerm: string = "";

  constructor(
    private router: Router,
    private articleManagementService: ArticleManagementService,
    private auth: AuthService,
    private windowResizeService: WindowResizeService,
    @Inject(LOCALE_ID) public locale: string) {
  }

  loadData() {
    this.searchTerm == "" ? null : this.searchTerm;

    this.articleManagementService.getAll(this.searchTerm)
      .subscribe(result => {
        if (result.isSuccess) {
          result.data.forEach(item => {
            item.fileResult = item.fileResult.fileContents = "data:" + item.fileResult.contentType + ";base64," + item.fileResult.fileContents;
          })

          this.dataSource = result.data;
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

    this.loadData();
  }
  

  ngAfterViewInit(): void {

  }

  onSearch() {
    if (this.searchTerm === this.lastSearchTerm) {
      return;
    }

    this.lastSearchTerm = this.searchTerm;
    this.loadData();
  }

  articleEditView(articleId: number) {
    this.router.navigate(['articles/' + articleId]);
  }
}
