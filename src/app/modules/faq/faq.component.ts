import { Component, OnInit } from '@angular/core';
import { FAQManagementService } from './faq-management.service';
import { FAQModel } from './models/faq.model';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FAQComponent implements OnInit {
  faqs: FAQModel[] = [];

  constructor(private faqService: FAQManagementService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.faqService.getAll().subscribe(result => {
      this.faqs = result.isSuccess ? result.data : [];
    });
  }

  trackByFaqId(index: number, faq: FAQModel): number {
    return faq.id;
  }
}
