import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleComponent } from './article.component';
import { ArticleViewComponent } from './view/article-view.component';
import { AuthGuard } from '../auth/services/auth.guard';

const routes: Routes = [
  {
      path: '',
      children: [
        {
          path: '',
          component: ArticleComponent,
        },
        {
          path: ':id',
          component: ArticleViewComponent,
        },
      ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticleRoutingModule {}
