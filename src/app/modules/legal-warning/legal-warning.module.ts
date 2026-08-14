import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalContentSharedModule } from '../common/legal-content/legal-content-shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { ModalsModule } from 'src/app/_metronic/partials';
import { ConfirmationModule } from '../confirmation/confirmation.module';
import { DataTableModule } from '../common/datatable/datatable.module';
import { LegalWarningComponent } from './legal-warning.component';
import { LegalWarningRoutingModule } from './legal-warning-routing.module';

@NgModule({
  declarations: [
    LegalWarningComponent
  ],
  imports: [
    DataTableModule,
    ConfirmationModule,
    CommonModule,
    LegalContentSharedModule,
    TranslationModule,
    LegalWarningRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalsModule
  ],
})
export class LegalWarningModule {}
