import { Component } from '@angular/core';

@Component({
  selector: 'app-community-rules',
  templateUrl: './community-rules.component.html',
  styleUrls: ['./community-rules.component.scss'],
})
export class CommunityRulesComponent {
  ruleItems = [
    {
      title: 'COMMUNITY_RULES.SECTIONS.RESPECT.TITLE',
      text: 'COMMUNITY_RULES.SECTIONS.RESPECT.TEXT',
    },
    {
      title: 'COMMUNITY_RULES.SECTIONS.CONTENT_REVIEW.TITLE',
      text: 'COMMUNITY_RULES.SECTIONS.CONTENT_REVIEW.TEXT',
    },
    {
      title: 'COMMUNITY_RULES.SECTIONS.REPORTING.TITLE',
      text: 'COMMUNITY_RULES.SECTIONS.REPORTING.TEXT',
    },
  ];

  prohibitedItems = [
    'COMMUNITY_RULES.PROHIBITED.INSULT',
    'COMMUNITY_RULES.PROHIBITED.HATE_SPEECH',
    'COMMUNITY_RULES.PROHIBITED.THREAT',
    'COMMUNITY_RULES.PROHIBITED.SPAM',
    'COMMUNITY_RULES.PROHIBITED.PERSONAL_DONATION',
    'COMMUNITY_RULES.PROHIBITED.ILLEGAL',
  ];

  policyItems = [
    {
      title: 'COMMUNITY_RULES.SECTIONS.MEMORIAL_POLICY.TITLE',
      text: 'COMMUNITY_RULES.SECTIONS.MEMORIAL_POLICY.TEXT',
    },
    {
      title: 'COMMUNITY_RULES.SECTIONS.MEMORIAL_PAGES.TITLE',
      text: 'COMMUNITY_RULES.SECTIONS.MEMORIAL_PAGES.TEXT',
    },
    {
      title: 'COMMUNITY_RULES.SECTIONS.REMOVAL_RIGHT.TITLE',
      text: 'COMMUNITY_RULES.SECTIONS.REMOVAL_RIGHT.TEXT',
    },
    {
      title: 'COMMUNITY_RULES.SECTIONS.CONTENT_REPORT.TITLE',
      text: 'COMMUNITY_RULES.SECTIONS.CONTENT_REPORT.TEXT',
    },
  ];
}