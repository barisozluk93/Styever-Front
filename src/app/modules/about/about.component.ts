import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import { LayoutInitService } from 'src/app/_metronic/layout/core/layout-init.service';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { AuthService } from '../auth';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, AfterViewInit {

  bannerHeight?: number;
  bannerPaddingTopHeight?: number;

  constructor(
    private router: Router,
    private auth: AuthService,
    private windowResizeService: WindowResizeService,
  ) {
  }

  goToOffers() {
    document.getElementById("offers")?.scrollIntoView({ behavior: 'smooth' });
  }

  goToSignUp() {
    if (this.auth.currentUserValue) {
      this.router.navigate(["memories/new/"])

    }
    else {
      this.router.navigate(['/auth/registration'], {
        queryParams: {},
      });
    }
  }

  goToAbout() {
    this.router.navigate(['/about'], {
      queryParams: {},
    });
  }

  goToMemories() {
    this.router.navigate(['/memories'], {
      queryParams: {},
    });
  }

  goToStandBy() {
    this.router.navigate(['/giftvoucher'], {
      queryParams: {},
    });
  }

  ngOnInit(): void {
    this.windowResizeService.resize$
    .subscribe(size => {
      this.bannerHeight =  (size.height / 2) - document.getElementById("kt_header")?.clientHeight!;
      this.bannerPaddingTopHeight = this.bannerHeight / 6;
    });
  }

  ngAfterViewInit(): void {

  }
}
