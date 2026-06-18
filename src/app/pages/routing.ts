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
    path: 'terms-of-use',
    loadChildren: () =>
      import('../modules/terms-of-use/terms-of-use.module').then((m) => m.TermsOfUseModule),
  },
  {
    path: 'distance-sales-agreement',
    loadChildren: () =>
      import('../modules/distance-sales-agreement/distance-sales-agreement.module').then((m) => m.DistanceSalesAgreementModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('../modules/privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyModule),
  },
  {
    path: 'cookie-policy',
    loadChildren: () =>
      import('../modules/cookie-policy/cookie-policy.module').then((m) => m.CookiePolicyModule),
  },
  {
    path: 'kvkk',
    loadChildren: () =>
      import('../modules/kvkk/kvkk.module').then((m) => m.KvkkModule),
  },
    {
    path: 'cancellation-refund-policy',
    loadChildren: () =>
      import('../modules/cancellation-refund-policy/cancellation-refund-policy.module').then((m) => m.CancellationRefundPolicyModule),
  },
  {
    path: 'legal-warning',
    loadChildren: () =>
      import('../modules/legal-warning/legal-warning.module').then((m) => m.LegalWarningModule),
  },
  // {
  //   path: 'social-responsibility-policy',
  //   loadChildren: () =>
  //     import('../modules/social-responsibility-policy/social-responsibility-policy.module').then((m) => m.SocialResponsibilityPolicyModule),
  // },
  {
    path: 'community-rules',
    loadChildren: () =>
      import('../modules/community-rules/community-rules.module').then((m) => m.CommunityRulesModule),
  },
  {
    path: 'moderation-policy',
    loadChildren: () =>
      import('../modules/moderation-policy/moderation-policy.module').then((m) => m.ModerationPolicyModule),
  },
  // {
  //   path: 'content-removal-policy',
  //   loadChildren: () =>
  //     import('../modules/content-removal-policy/content-removal-policy.module').then((m) => m.ContentRemovalPolicyModule),
  // },
  {
    path: 'report-content',
    loadChildren: () =>
      import('../modules/report-content/report-content.module').then((m) => m.ReportContentModule),
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
