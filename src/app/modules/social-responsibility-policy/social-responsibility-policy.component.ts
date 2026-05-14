import { Component } from '@angular/core';

@Component({
  selector: 'app-social-responsibility-policy',
  templateUrl: './social-responsibility-policy.component.html',
  styleUrls: ['./social-responsibility-policy.component.scss'],
})
export class SocialResponsibilityPolicyComponent {
  policyItems = [
    {
      title: 'SOCIAL_RESPONSIBILITY_POLICY.SECTIONS.PURPOSE.TITLE',
      text: 'SOCIAL_RESPONSIBILITY_POLICY.SECTIONS.PURPOSE.TEXT',
    },
    {
      title: 'SOCIAL_RESPONSIBILITY_POLICY.SECTIONS.TRANSFER_RATES.TITLE',
      text: 'SOCIAL_RESPONSIBILITY_POLICY.SECTIONS.TRANSFER_RATES.TEXT',
    },
    {
      title: 'SOCIAL_RESPONSIBILITY_POLICY.SECTIONS.TRANSPARENCY.TITLE',
      text: 'SOCIAL_RESPONSIBILITY_POLICY.SECTIONS.TRANSPARENCY.TEXT',
    },
    {
      title: 'SOCIAL_RESPONSIBILITY_POLICY.SECTIONS.REFUND_POLICY.TITLE',
      text: 'SOCIAL_RESPONSIBILITY_POLICY.SECTIONS.REFUND_POLICY.TEXT',
    },
  ];
}