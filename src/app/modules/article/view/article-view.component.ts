import {Component, ElementRef, inject, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleManagementService} from '../article-management.service';
import {environment} from 'src/environments/environment';

@Component({
  selector:'app-article-view',
  templateUrl:'./article-view.component.html',
  styleUrls:['./article-view.component.scss'],
})
export class ArticleViewComponent implements OnInit{
  @ViewChild('articleContent') articleContent?:ElementRef<HTMLElement>;
  private route=inject(ActivatedRoute);
  articleId:number;
  article:any|undefined;

  constructor(
    private articleManagementService:ArticleManagementService,
    @Inject(LOCALE_ID) public locale:string,
    private router:Router
  ){}

  ngOnInit():void{
    this.articleId=Number(this.route.snapshot.params['id']);
    this.getById();
  }

  getById():void{
    this.articleManagementService.getById(this.articleId).subscribe(result=>{
      if(result.isSuccess){
        if(result.data.file?.path){
          const fileName=String(result.data.file.path).replace(/\\/g,'/').split('/').pop();
          result.data.fileUrl=fileName ? environment.articleUploadFolderUrl+'/'+fileName : undefined;
        }
        this.article=result.data;
      }else{
        this.article=undefined;
      }
    });
  }

  goToArticles():void{this.router.navigate(['/support']);}
  scrollToContent():void{this.articleContent?.nativeElement.scrollIntoView({behavior:'smooth',block:'start'});}
  goToFaq():void{this.router.navigate(['/faq']);}
}
