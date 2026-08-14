import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FAQManagementComponent } from './faq-management.component';
const routes: Routes = [{ path: '', component: FAQManagementComponent }];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class FAQManagementRoutingModule {}
