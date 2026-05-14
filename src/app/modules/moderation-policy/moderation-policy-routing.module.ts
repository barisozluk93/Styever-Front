import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModerationPolicyComponent } from './moderation-policy.component';


const routes: Routes = [
  {
    path: '',
    component: ModerationPolicyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModerationPolicyRoutingModule {}
