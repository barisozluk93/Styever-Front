import { Component } from '@angular/core';

@Component({
  selector: 'app-distance-sales-agreement',
  templateUrl: './distance-sales-agreement.component.html',
  styleUrls: ['./distance-sales-agreement.component.scss'],
})
export class DistanceSalesAgreementComponent {
  preInfoItems = [
    {
      title: 'DISTANCE_SALES.PRE_INFO.SELLER.TITLE',
      text: 'DISTANCE_SALES.PRE_INFO.SELLER.TEXT',
    },
    {
      title: 'DISTANCE_SALES.PRE_INFO.SERVICE.TITLE',
      text: 'DISTANCE_SALES.PRE_INFO.SERVICE.TEXT',
    },
    {
      title: 'DISTANCE_SALES.PRE_INFO.SOCIAL_RESPONSIBILITY.TITLE',
      text: 'DISTANCE_SALES.PRE_INFO.SOCIAL_RESPONSIBILITY.TEXT',
    },
    {
      title: 'DISTANCE_SALES.PRE_INFO.WITHDRAWAL.TITLE',
      text: 'DISTANCE_SALES.PRE_INFO.WITHDRAWAL.TEXT',
    },
    {
      title: 'DISTANCE_SALES.PRE_INFO.COMPLAINT.TITLE',
      text: 'DISTANCE_SALES.PRE_INFO.COMPLAINT.TEXT',
    },
  ];

  agreementItems = [
    {
      title: 'DISTANCE_SALES.AGREEMENT.PARTIES.TITLE',
      text: 'DISTANCE_SALES.AGREEMENT.PARTIES.TEXT',
    },
    {
      title: 'DISTANCE_SALES.AGREEMENT.SUBJECT.TITLE',
      text: 'DISTANCE_SALES.AGREEMENT.SUBJECT.TEXT',
    },
    {
      title: 'DISTANCE_SALES.AGREEMENT.SERVICE_FEATURES.TITLE',
      text: 'DISTANCE_SALES.AGREEMENT.SERVICE_FEATURES.TEXT',
    },
    {
      title: 'DISTANCE_SALES.AGREEMENT.SOCIAL_RESPONSIBILITY_SUPPORT.TITLE',
      text: 'DISTANCE_SALES.AGREEMENT.SOCIAL_RESPONSIBILITY_SUPPORT.TEXT',
    },
    {
      title: 'DISTANCE_SALES.AGREEMENT.PAYMENT_SECURITY.TITLE',
      text: 'DISTANCE_SALES.AGREEMENT.PAYMENT_SECURITY.TEXT',
    },
    {
      title: 'DISTANCE_SALES.AGREEMENT.WITHDRAWAL_EXCEPTION.TITLE',
      text: 'DISTANCE_SALES.AGREEMENT.WITHDRAWAL_EXCEPTION.TEXT',
    },
  ];
}