import {Component, ElementRef, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {environment} from 'src/environments/environment';
import {ArticleManagementService} from './article-management.service';
import {ArticleModel} from './models/article.model';

@Component({
  selector:'app-article',
  templateUrl:'./article.component.html',
  styleUrls:['./article.component.scss'],
})
export class ArticleComponent implements OnInit{
  @ViewChild('articlesSection') articlesSection?:ElementRef<HTMLElement>;

  dataSource:ArticleModel[]=[];
  searchTerm:string='';
  lastSearchTerm:string='';

  constructor(
    private router:Router,
    private articleManagementService:ArticleManagementService,
    private translate:TranslateService,
    @Inject(LOCALE_ID) public locale:string
  ){}

  ngOnInit():void{this.loadData();}

  loadData(scrollAfterLoad:boolean=false):void{
    this.articleManagementService.getAll(this.searchTerm || '',this.translate.currentLang).subscribe(result=>{
      if(result.isSuccess){
        result.data.forEach(item=>{
          if(item.file?.path){
            const fileName=String(item.file.path).replace(/\\/g,'/').split('/').pop();
            item.fileUrl=fileName ? environment.articleUploadFolderUrl+'/'+fileName : undefined;
          }
        });
        this.dataSource=result.data;
        if(scrollAfterLoad){
          setTimeout(()=>this.scrollToArticles(),0);
        }
      }
    });
  }

  onSearch():void{
    const normalizedSearch=this.searchTerm.trim();
    this.searchTerm=normalizedSearch;

    if(normalizedSearch===this.lastSearchTerm){
      this.scrollToArticles();
      return;
    }

    this.lastSearchTerm=normalizedSearch;
    this.loadData(true);
  }

  private scrollToArticles():void{
    this.articlesSection?.nativeElement.scrollIntoView({behavior:'smooth',block:'start'});
  }

  articleEditView(articleId:number):void{this.router.navigate(['support/'+articleId]);}
  goToFaq():void{this.router.navigate(['/faq']);}
  goToContact():void{this.router.navigate(['/contactus']);}
  trackByArticleId(index:number,item:ArticleModel):number{return item.id;}
}
