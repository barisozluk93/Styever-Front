import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from '../i18n/translation.module';
import { DataTableModule } from '../common/datatable/datatable.module';
import { ConfirmationModule } from '../confirmation/confirmation.module';
import { ModalsModule } from 'src/app/_metronic/partials';
import { RichTextEditorModule } from '../common/rich-text-editor/rich-text-editor.module';
import { SupportManagementRoutingModule } from './support-management-routing.module';
import { SupportManagementComponent } from './support-management.component';
import { SupportEditSaveComponent } from './edit-save/edit-save.component';
@NgModule({ declarations: [SupportManagementComponent, SupportEditSaveComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslationModule, DataTableModule, ConfirmationModule, ModalsModule, RichTextEditorModule, SupportManagementRoutingModule] })
export class SupportManagementModule {}
