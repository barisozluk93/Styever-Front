import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalContentSharedModule } from '../common/legal-content/legal-content-shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { ModalsModule } from 'src/app/_metronic/partials';
import { ConfirmationModule } from '../confirmation/confirmation.module';
import { DataTableModule } from '../common/datatable/datatable.module';
import { TermsOfUseComponent } from './terms-of-use.component';
import { TermsOfUseRoutingModule } from './terms-of-use-routing.module';

@NgModule({
  declarations: [
    TermsOfUseComponent
  ],
  imports: [
    DataTableModule,
    ConfirmationModule,
    CommonModule,
    LegalContentSharedModule,
    TranslationModule,
    TermsOfUseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalsModule
  ],
})
export class TermsOfUseModule {}
