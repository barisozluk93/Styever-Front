import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { LayoutModule } from 'src/app/_metronic/layout';
import { InlineSVGModule } from 'ng-inline-svg-2';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InlineSVGModule,
  ],
})
export class HomeModule {}
