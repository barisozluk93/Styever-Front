import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { ModalsModule } from 'src/app/_metronic/partials';
import { ConfirmationModule } from '../confirmation/confirmation.module';
import { DataTableModule } from '../common/datatable/datatable.module';
import { KvkkComponent } from './kvkk.component';
import { KvkkRoutingModule } from './kvkk-routing.module';
import { LegalContentSharedModule } from '../common/legal-content/legal-content-shared.module';

@NgModule({
  declarations: [
    KvkkComponent
  ],
  imports: [
    DataTableModule,
    ConfirmationModule,
    CommonModule,
    TranslationModule,
    KvkkRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalsModule,
    LegalContentSharedModule  
  ],
})
export class KvkkModule {}
