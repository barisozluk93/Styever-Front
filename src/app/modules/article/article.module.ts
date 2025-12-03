import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { LayoutModule } from 'src/app/_metronic/layout';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbCarouselModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalsModule } from 'src/app/_metronic/partials';
import { ArticleViewComponent } from './view/article-view.component';
import { ArticleComponent } from './article.component';
import { ArticleRoutingModule } from './article-routing.module';

@NgModule({
  declarations: [
    ArticleComponent,
    ArticleViewComponent
  ],
  imports: [
    CommonModule,
    TranslationModule,
    ArticleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InlineSVGModule,
    NgbPaginationModule,
    ModalsModule,
    NgbCarouselModule
  ],
})
export class ArticleModule {}
