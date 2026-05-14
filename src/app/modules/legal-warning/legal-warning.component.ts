import { Component } from '@angular/core';

@Component({
  selector: 'app-legal-warning',
  templateUrl: './legal-warning.component.html',
  styleUrls: ['./legal-warning.component.scss'],
})
export class LegalWarningComponent {
  legalItems = [
    'LEGAL_WARNING.INTRO.P1',
    'LEGAL_WARNING.INTRO.P2',
    'LEGAL_WARNING.INTRO.P3',
    'LEGAL_WARNING.INTRO.P4',
    'LEGAL_WARNING.INTRO.P5',
    'LEGAL_WARNING.INTRO.P6',
    'LEGAL_WARNING.INTRO.P7',
    'LEGAL_WARNING.INTRO.P8',
    'LEGAL_WARNING.INTRO.P9',
    'LEGAL_WARNING.INTRO.P10',
    'LEGAL_WARNING.INTRO.P11',
  ];

  notResponsibleItems = [
    'LEGAL_WARNING.NOT_RESPONSIBLE.USER_CONTENT',
    'LEGAL_WARNING.NOT_RESPONSIBLE.USER_COMMENTS',
    'LEGAL_WARNING.NOT_RESPONSIBLE.THIRD_PARTY',
    'LEGAL_WARNING.NOT_RESPONSIBLE.TECHNICAL',
  ];
}