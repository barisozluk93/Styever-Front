import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import { LayoutInitService } from 'src/app/_metronic/layout/core/layout-init.service';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { FAQManagementService } from './faq-management.service';
import { FAQModel } from './models/faq.model';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FAQComponent implements OnInit, AfterViewInit {
  bannerHeight?: number;
  bannerPaddingTopHeight?: number;

  faqs: FAQModel[] = [];

  constructor(
    private windowResizeService: WindowResizeService,
    private faqService: FAQManagementService) {
  }

  loadData() {
    this.faqService.getAll().subscribe(result => {
      if(result.isSuccess) {
        this.faqs = result.data;
      }
      else{
        this.faqs = [];
      }
    })
  }

  ngOnInit(): void {
    this.windowResizeService.resize$
    .subscribe(size => {
      this.bannerHeight =  (size.height / 2) - document.getElementById("kt_header")?.clientHeight!;
      this.bannerPaddingTopHeight = this.bannerHeight / 4;
    });

    this.loadData();
  }

  ngAfterViewInit(): void {
    
  }
}
