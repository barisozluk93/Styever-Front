import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalContentSharedModule } from '../common/legal-content/legal-content-shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthComponent } from './auth.component';
import { TranslationModule } from '../i18n/translation.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { PlansModule } from '../common/plans/plans.module';
import { ModalsModule } from 'src/app/_metronic/partials/layout/modals/modals.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    ResetPasswordComponent,
    AuthComponent,
  ],
  imports: [
    PlansModule,
    CommonModule,
    LegalContentSharedModule,
    InlineSVGModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalsModule
  ],
})
export class AuthModule {}
