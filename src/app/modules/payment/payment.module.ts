import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalContentSharedModule } from '../common/legal-content/legal-content-shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { LayoutModule } from 'src/app/_metronic/layout';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PaymentComponent } from './payment.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { AccountModule } from '../account/account.module';
import { ModalsModule } from 'src/app/_metronic/partials';

@NgModule({
  declarations: [
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    LegalContentSharedModule,
    TranslationModule,
    PaymentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InlineSVGModule,
    AccountModule,
    ModalsModule
  ],
})
export class PaymentModule {}
