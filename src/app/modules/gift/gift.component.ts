import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import { LayoutInitService } from 'src/app/_metronic/layout/core/layout-init.service';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { GiftManagementService } from './gift-management.service';
import { TranslateService } from '@ngx-translate/core';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.scss'],
})
export class GiftComponent implements OnInit, AfterViewInit {
  bannerHeight?: number;
  bannerPaddingTopHeight?: number;


  constructor(
    private windowResizeService: WindowResizeService,
    private giftService: GiftManagementService,
    private translate: TranslateService) {
  }

  goToPlans() {
    document.getElementById("plans")?.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit(): void {
    this.windowResizeService.resize$
    .subscribe(size => {
      this.bannerHeight =  (size.height / 2) - document.getElementById("kt_header")?.clientHeight!;
      this.bannerPaddingTopHeight = this.bannerHeight / 3;
    });
  }

  ngAfterViewInit(): void {
    
  }
}
