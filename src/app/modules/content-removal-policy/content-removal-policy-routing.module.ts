import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentRemovalPolicyComponent } from './content-removal-policy.component';


const routes: Routes = [
  {
    path: '',
    component: ContentRemovalPolicyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentRemovalPolicyRoutingModule {}
