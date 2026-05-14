import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { ModalsModule } from 'src/app/_metronic/partials';
import { ConfirmationModule } from '../confirmation/confirmation.module';
import { DataTableModule } from '../common/datatable/datatable.module';
import { SocialResponsibilityPolicyComponent } from './social-responsibility-policy.component';
import { SocialResponsibilityPolicyRoutingModule } from './social-responsibility-policy-routing.module';

@NgModule({
  declarations: [
    SocialResponsibilityPolicyComponent
  ],
  imports: [
    DataTableModule,
    ConfirmationModule,
    CommonModule,
    TranslationModule,
    SocialResponsibilityPolicyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalsModule
  ],
})
export class SocialResponsibilityPolicyModule {}
