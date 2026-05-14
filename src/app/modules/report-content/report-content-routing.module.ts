import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportContentComponent } from './report-content.component';


const routes: Routes = [
  {
    path: '',
    component: ReportContentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportContentRoutingModule {}
