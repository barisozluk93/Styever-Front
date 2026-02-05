import { Routes } from '@angular/router';
import { AuthGuard } from '../modules/auth/services/auth.guard';

const Routing: Routes = [
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'usermanagement',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../modules/user-management/user-management.module').then((m) => m.UserManagementModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('../modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('../modules/about/about.module').then((m) => m.AboutModule),
  },
  {
    path: 'memories',
    loadChildren: () =>
      import('../modules/memory/memory.module').then((m) => m.MemoryModule),
  },
  {
    path: 'giftvoucher',
    loadChildren: () =>
      import('../modules/gift/gift.module').then((m) => m.GiftModule),
  },
  {
    path: 'support',
    loadChildren: () =>
      import('../modules/article/article.module').then((m) => m.ArticleModule),
  },
  {
    path: 'faq',
    loadChildren: () =>
      import('../modules/faq/faq.module').then((m) => m.FAQModule),
  },
  {
    path: 'contactus',
    loadChildren: () =>
      import('../modules/contactus/contactus.module').then((m) => m.ContactUsModule),
  },
  {
    path: 'payment',
    loadChildren: () =>
      import('../modules/payment/payment.module').then((m) => m.PaymentModule),
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
