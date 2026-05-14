import { Component } from '@angular/core';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss'],
})
export class CookiePolicyComponent {
  introItems = [
    'COOKIE_POLICY.INTRO.P1',
    'COOKIE_POLICY.INTRO.P2',
    'COOKIE_POLICY.INTRO.P3',
  ];

  purposeItems = [
    'COOKIE_POLICY.PURPOSES.SESSION',
    'COOKIE_POLICY.PURPOSES.SECURITY',
    'COOKIE_POLICY.PURPOSES.PERFORMANCE',
  ];
}