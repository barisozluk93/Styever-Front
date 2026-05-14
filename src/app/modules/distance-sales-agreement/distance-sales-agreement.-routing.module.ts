import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DistanceSalesAgreementComponent } from './distance-sales-agreement.component';


const routes: Routes = [
  {
    path: '',
    component: DistanceSalesAgreementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistanceSalesAgreementRoutingModule {}
