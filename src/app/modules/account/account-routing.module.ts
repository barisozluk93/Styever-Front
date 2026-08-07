import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { SettingsComponent } from './settings/settings.component';
import { AddressesComponent } from './addresses/addresses.component';
import { MembershipComponent } from './membership/membership.component';
import { AccountAgreementsComponent } from './agreements/agreements.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'addresses',
        component: AddressesComponent,
      },
      {
        path: 'membership',
        component: MembershipComponent,
      },
      {
        path: 'agreements',
        component: AccountAgreementsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
