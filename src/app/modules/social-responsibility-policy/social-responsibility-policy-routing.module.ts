import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SocialResponsibilityPolicyComponent } from './social-responsibility-policy.component';


const routes: Routes = [
  {
    path: '',
    component: SocialResponsibilityPolicyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialResponsibilityPolicyRoutingModule {}
