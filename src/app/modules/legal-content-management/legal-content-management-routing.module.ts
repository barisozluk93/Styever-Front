import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalContentManagementComponent } from './legal-content-management.component';
const routes: Routes = [{ path: '', component: LegalContentManagementComponent }];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class LegalContentManagementRoutingModule {}
