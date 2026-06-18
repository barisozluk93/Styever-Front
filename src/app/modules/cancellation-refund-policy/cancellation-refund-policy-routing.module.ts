import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancellationRefundPolicyComponent } from './cancellation-refund-policy.component';


const routes: Routes = [
  {
    path: '',
    component: CancellationRefundPolicyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancellationRefundPolicyRoutingModule {}
