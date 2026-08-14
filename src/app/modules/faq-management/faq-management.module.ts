import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from '../i18n/translation.module';
import { DataTableModule } from '../common/datatable/datatable.module';
import { ConfirmationModule } from '../confirmation/confirmation.module';
import { ModalsModule } from 'src/app/_metronic/partials';
import { RichTextEditorModule } from '../common/rich-text-editor/rich-text-editor.module';
import { FAQManagementRoutingModule } from './faq-management-routing.module';
import { FAQManagementComponent } from './faq-management.component';
import { FAQEditSaveComponent } from './edit-save/edit-save.component';
@NgModule({ declarations: [FAQManagementComponent, FAQEditSaveComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslationModule, DataTableModule, ConfirmationModule, ModalsModule, RichTextEditorModule, FAQManagementRoutingModule] })
export class FAQManagementAdminModule {}
