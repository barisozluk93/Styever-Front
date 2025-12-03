import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemoryComponent } from './memory.component';
import { MemoryViewComponent } from './view/memory-view.component';
import { MemoryEditComponent } from './edit/memory-edit.component';
import { AuthGuard } from '../auth/services/auth.guard';

const routes: Routes = [
  {
      path: '',
      children: [
        {
          path: '',
          component: MemoryComponent
        },
        {
          path: 'new',
          component: MemoryEditComponent,
          canActivate: [AuthGuard]
        },
        {
          path: ':id',
          component: MemoryViewComponent,
        },
        {
          path: 'edit/:id',
          component: MemoryEditComponent,
          canActivate: [AuthGuard]
        },
      ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemoryRoutingModule {}
