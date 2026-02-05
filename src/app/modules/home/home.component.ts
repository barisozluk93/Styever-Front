import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/_metronic/layout';
import { LayoutInitService } from 'src/app/_metronic/layout/core/layout-init.service';
import { WindowResizeService } from 'src/app/windwow-resize-service/windowresize.service';
import { AuthService } from '../auth';

// const BODY_CLASSES = ['bgi-size-cover', 'bgi-position-center', 'bgi-no-repeat'];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {

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
        this.bannerHeight = window.innerHeight - (document.getElementById("kt_header")?.clientHeight! + 1);
        this.bannerPaddingTopHeight = this.bannerHeight / 4;
      });
  }

  ngAfterViewInit(): void {

  }
}
