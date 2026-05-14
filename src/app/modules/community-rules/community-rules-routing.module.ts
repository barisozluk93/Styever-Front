import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityRulesComponent } from './community-rules.component';


const routes: Routes = [
  {
    path: '',
    component: CommunityRulesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRulesRoutingModule {}
