import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from '../i18n/translation.module';
import { ModalsModule } from 'src/app/_metronic/partials';
import { RichTextEditorModule } from '../common/rich-text-editor/rich-text-editor.module';
import { DataTableModule } from '../common/datatable/datatable.module';
import { ConfirmationModule } from '../confirmation/confirmation.module';
import { LegalContentManagementRoutingModule } from './legal-content-management-routing.module';
import { LegalContentManagementComponent } from './legal-content-management.component';
import { LegalContentEditSaveComponent } from './edit-save/edit-save.component';

@NgModule({
  declarations: [LegalContentManagementComponent, LegalContentEditSaveComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslationModule,
    ModalsModule,
    RichTextEditorModule,
    DataTableModule,
    ConfirmationModule,
    LegalContentManagementRoutingModule
  ]
})
export class LegalContentManagementModule {}
