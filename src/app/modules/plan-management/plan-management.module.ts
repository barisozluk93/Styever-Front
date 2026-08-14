import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationModule } from '../i18n/translation.module';
import { ModalsModule } from 'src/app/_metronic/partials';
import { PlanManagementRoutingModule } from './plan-management-routing.module';
import { PlanManagementComponent } from './plan-management.component';
import { PlanEditSaveComponent } from './edit-save/edit-save.component';

@NgModule({
  declarations: [PlanManagementComponent, PlanEditSaveComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslationModule, ModalsModule, PlanManagementRoutingModule]
})
export class PlanManagementModule {}
