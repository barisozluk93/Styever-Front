import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LegalWarningComponent } from './legal-warning.component';


const routes: Routes = [
  {
    path: '',
    component: LegalWarningComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalWarningRoutingModule {}
