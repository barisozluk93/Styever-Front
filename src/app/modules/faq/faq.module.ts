import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { LayoutModule } from 'src/app/_metronic/layout';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FAQComponent } from './faq.component';
import { FAQRoutingModule } from './faq-routing.module';

@NgModule({
  declarations: [
    FAQComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    FAQRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InlineSVGModule
  ],
})
export class FAQModule {}
