import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { LayoutModule } from 'src/app/_metronic/layout';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MemoryComponent } from './memory.component';
import { MemoryRoutingModule } from './memory-routing.module';
import { NgbCarouselModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommentComponent } from './comment/comment.component';
import { ModalsModule } from 'src/app/_metronic/partials';
import { LikeComponent } from './like/like.component';
import { CarouselComponent } from './carousel/carousel.component';
import { MemoryViewComponent } from './view/memory-view.component';
import { MemoryEditComponent } from './edit/memory-edit.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    MemoryComponent,
    CommentComponent,
    LikeComponent,
    MemoryViewComponent,
    CarouselComponent,
    MemoryEditComponent
  ],
  imports: [
    CommonModule,
    TranslationModule,
    MemoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InlineSVGModule,
    NgbPaginationModule,
    ModalsModule,
    NgbCarouselModule,
    QRCodeModule
  ],
})
export class MemoryModule {}
