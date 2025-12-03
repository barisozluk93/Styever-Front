import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { LayoutModule } from 'src/app/_metronic/layout';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ContactUsComponent } from './contactus.component';
import { ContactUsRoutingModule } from './contactus-routing.module';

@NgModule({
  declarations: [
    ContactUsComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    ContactUsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InlineSVGModule
  ],
})
export class ContactUsModule {}
