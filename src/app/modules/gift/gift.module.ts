import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { LayoutModule } from 'src/app/_metronic/layout';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { GiftRoutingModule } from './gift-routing.module';
import { GiftComponent } from './gift.component';
import { PlansModule } from '../common/plans/plans.module';

@NgModule({
  declarations: [
    GiftComponent,
  ],
  imports: [
    PlansModule,
    CommonModule,
    TranslationModule,
    GiftRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InlineSVGModule
  ],
})
export class GiftModule {}
