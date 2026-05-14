import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CookiePolicyComponent } from './cookie-policy.component';


const routes: Routes = [
  {
    path: '',
    component: CookiePolicyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CookiePolicyRoutingModule {}
