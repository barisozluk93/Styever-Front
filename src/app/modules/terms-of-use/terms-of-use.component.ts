import { Component } from '@angular/core';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.scss'],
})
export class TermsOfUseComponent {
  termsItems = [
    {
      title: 'TERMS.SECTIONS.PLATFORM.TITLE',
      text: 'TERMS.SECTIONS.PLATFORM.TEXT',
    },
    {
      title: 'TERMS.SECTIONS.ACCOUNT.TITLE',
      text: 'TERMS.SECTIONS.ACCOUNT.TEXT',
    },
    {
      title: 'TERMS.SECTIONS.USER_CONTENT.TITLE',
      text: 'TERMS.SECTIONS.USER_CONTENT.TEXT',
    },
    {
      title: 'TERMS.SECTIONS.PROHIBITED_CONTENT.TITLE',
      text: 'TERMS.SECTIONS.PROHIBITED_CONTENT.TEXT',
    },
    {
      title: 'TERMS.SECTIONS.COMMENTS.TITLE',
      text: 'TERMS.SECTIONS.COMMENTS.TEXT',
    },
    {
      title: 'TERMS.SECTIONS.SOCIAL_RESPONSIBILITY.TITLE',
      text: 'TERMS.SECTIONS.SOCIAL_RESPONSIBILITY.TEXT',
    },
    {
      title: 'TERMS.SECTIONS.HOSTING_PROVIDER.TITLE',
      text: 'TERMS.SECTIONS.HOSTING_PROVIDER.TEXT',
    },
    {
      title: 'TERMS.SECTIONS.PAYMENTS.TITLE',
      text: 'TERMS.SECTIONS.PAYMENTS.TEXT',
    },
    {
      title: 'TERMS.SECTIONS.REFUND.TITLE',
      text: 'TERMS.SECTIONS.REFUND.TEXT',
    },
    {
      title: 'TERMS.SECTIONS.APPLICABLE_LAW.TITLE',
      text: 'TERMS.SECTIONS.APPLICABLE_LAW.TEXT',
    },
  ];
}