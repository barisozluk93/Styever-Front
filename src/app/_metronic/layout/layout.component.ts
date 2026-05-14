import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { LayoutService } from './core/layout.service';
import { LayoutInitService } from './core/layout-init.service';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { NotificationSignalrService } from 'src/app/modules/common/signalR.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  // Public variables
  selfLayout = 'default';
  asideSelfDisplay: true;
  asideMenuStatic: true;
  contentClasses = '';
  contentContainerClasses = '';
  toolbarDisplay = true;
  contentExtended: false;
  asideCSSClasses: string;
  asideHTMLAttributes: any = {};
  headerMobileClasses = '';
  headerMobileAttributes = {};
  footerDisplay: boolean;
  footerCSSClasses: string;
  headerCSSClasses: string;
  headerHTMLAttributes: any = {};
  // offcanvases
  extrasSearchOffcanvasDisplay = false;
  extrasNotificationsOffcanvasDisplay = false;
  extrasQuickActionsOffcanvasDisplay = false;
  extrasCartOffcanvasDisplay = false;
  extrasUserOffcanvasDisplay = false;
  extrasQuickPanelDisplay = false;
  extrasScrollTopDisplay = false;
  asideDisplay: boolean = true;
  @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;

  isMobile: boolean = true;
  isWhitePage: boolean = false;
  isScrolled: boolean = false;

  private unsubscribe: Subscription[] = [];

  constructor(
    private initService: LayoutInitService,
    private layout: LayoutService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationSignalrService
  ) {
    this.initService.init();

  }

  setMobility(width: number) {
    if (width >= 992) {
      this.asideDisplay = false;
      this.isMobile = false;

      this.asideCSSClasses = "";
    }
    else {
      this.asideDisplay = true;
      this.isMobile = true;

      this.asideCSSClasses = "aside aside-extended drawer-start drawer";
    }
  }

  ngOnInit(): void {
    let scrollObservable$ = fromEvent(window, 'scroll', { capture: true })
    let scrollSubscription$ = scrollObservable$.subscribe(evt => {
      if (window.pageYOffset > 0) {
        this.isWhitePage = true;
        this.isScrolled = true;
      }
      else {
        this.isScrolled = false;
        this.controlRoute();
      }
    })

    let resizeObservable$ = fromEvent(window, 'resize')
    let resizeSubscription$ = resizeObservable$.subscribe(evt => {
      this.setMobility((evt.target as typeof window).innerWidth);
    })

    this.setMobility(window.innerWidth);

    // build view by layout config settings
    this.toolbarDisplay = this.layout.getProp('toolbar.display') as boolean;
    this.contentContainerClasses = this.layout.getStringCSSClasses('contentContainer');
    this.headerCSSClasses = this.layout.getStringCSSClasses('header');
    this.headerHTMLAttributes = this.layout.getHTMLAttributes('headerMenu');
    this.footerCSSClasses = this.layout.getStringCSSClasses('footer')

    if(this.authService.currentUserValue) {
      const authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
      const lsValue = localStorage.getItem(authLocalStorageToken);
      const authData = JSON.parse(lsValue!);

      if(authData?.accessToken){
        this.notificationService.startConnection(authData?.accessToken);
      }
    }

    // window.addEventListener("resize", this.onresize(this));
  }

  ngAfterViewInit(): void {
    if (this.ktHeader) {
      for (const key in this.headerHTMLAttributes) {
        if (this.headerHTMLAttributes.hasOwnProperty(key)) {
          this.ktHeader.nativeElement.attributes[key] =
            this.headerHTMLAttributes[key];
        }
      }
    }

    if(window.pageYOffset > 0) {
      this.isScrolled = true;
    }

    this.routingChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  routingChanges() {
    let currentUser = this.authService.currentUserValue;

    const routerSubscription = this.router.events.subscribe((event) => {

      this.setMobility(window.innerWidth);
      this.controlRoute();

    });

    this.unsubscribe.push(routerSubscription);
  }

  controlRoute() {
    var main = document.getElementById("main-element");
    
    if (this.router.url.includes("/home")) {
      main?.classList.remove("memory-background");
      main?.classList.remove("contactus-background");
      main?.classList.remove("payment-background");
      main?.classList.remove("memoryeditsave-background");
      main?.classList.remove("support-background");
      main?.classList.remove("faq-background");
      main?.classList.remove("gift-background");
      main?.classList.remove("about-background");

      main?.classList.add("home-background");
      this.isWhitePage = false;
    }
    else if (this.router.url.includes("/about")) {

      main?.classList.remove("home-background");
      main?.classList.remove("memory-background");
      main?.classList.remove("contactus-background");
      main?.classList.remove("payment-background");
      main?.classList.remove("memoryeditsave-background");
      main?.classList.remove("support-background");
      main?.classList.remove("faq-background");
      main?.classList.remove("gift-background");

      main?.classList.add("about-background");
      this.isWhitePage = false;
    }
    else if (this.router.url == "/memories") {

      main?.classList.remove("home-background");
      main?.classList.remove("contactus-background");
      main?.classList.remove("payment-background");
      main?.classList.remove("memoryeditsave-background");
      main?.classList.remove("support-background");
      main?.classList.remove("faq-background");
      main?.classList.remove("gift-background");
      main?.classList.remove("about-background");

      main?.classList.add("memory-background");
      this.isWhitePage = false;
    }
    else if (this.router.url.includes("/memories/")) {

      main?.classList.remove("memory-background");
      main?.classList.remove("home-background");
      main?.classList.remove("contactus-background");
      main?.classList.remove("payment-background");
      main?.classList.remove("support-background");
      main?.classList.remove("faq-background");
      main?.classList.remove("gift-background");
      main?.classList.remove("about-background");

      main?.classList.add("memoryeditsave-background");
      this.isWhitePage = false;
    }
    else if (this.router.url == "/faq") {

      main?.classList.remove("memory-background");
      main?.classList.remove("home-background");
      main?.classList.remove("contactus-background");
      main?.classList.remove("payment-background");
      main?.classList.remove("memoryeditsave-background");
      main?.classList.remove("support-background");
      main?.classList.remove("gift-background");
      main?.classList.remove("about-background");

      main?.classList.add("faq-background");
      this.isWhitePage = false;
    }
    else if (this.router.url == "/giftvoucher") {

      main?.classList.remove("memory-background");
      main?.classList.remove("home-background");
      main?.classList.remove("contactus-background");
      main?.classList.remove("payment-background");
      main?.classList.remove("memoryeditsave-background");
      main?.classList.remove("support-background");
      main?.classList.remove("faq-background");
      main?.classList.remove("about-background");

      main?.classList.add("gift-background");
      this.isWhitePage = false;
    }
    else if (this.router.url == "/contactus") {

      main?.classList.remove("home-background");
      main?.classList.remove("memory-background");
      main?.classList.remove("payment-background");
      main?.classList.remove("memoryeditsave-background");
      main?.classList.remove("support-background");
      main?.classList.remove("faq-background");
      main?.classList.remove("gift-background");
      main?.classList.remove("about-background");

      main?.classList.add("contactus-background");
      this.isWhitePage = false;
    }
    else if (this.router.url.includes("/payment")) {

      main?.classList.remove("home-background");
      main?.classList.remove("memory-background");
      main?.classList.remove("contactus-background");
      main?.classList.remove("memoryeditsave-background");
      main?.classList.remove("support-background");
      main?.classList.remove("faq-background");
      main?.classList.remove("gift-background");
      main?.classList.remove("about-background");

      main?.classList.add("payment-background");
      this.isWhitePage = false;
    }
    else if (this.router.url.includes("/support")) {

      main?.classList.remove("home-background");
      main?.classList.remove("contactus-background");
      main?.classList.remove("payment-background");
      main?.classList.remove("memoryeditsave-background");
      main?.classList.remove("memory-background");
      main?.classList.remove("faq-background");
      main?.classList.remove("gift-background");
      main?.classList.remove("about-background");

      main?.classList.add("support-background");
      this.isWhitePage = false;
    }
    else if (this.router.url.includes("/report-content")) {

      main?.classList.remove("home-background");
      main?.classList.remove("support-background");
      main?.classList.remove("payment-background");
      main?.classList.remove("memoryeditsave-background");
      main?.classList.remove("memory-background");
      main?.classList.remove("faq-background");
      main?.classList.remove("gift-background");
      main?.classList.remove("about-background");

      main?.classList.add("contactus-background");
      this.isWhitePage = false;
    }
    else {
      main?.classList.remove("home-background");
      main?.classList.remove("memory-background");
      main?.classList.remove("contactus-background");
      main?.classList.remove("payment-background");
      main?.classList.remove("memoryeditsave-background");
      main?.classList.remove("support-background");
      main?.classList.remove("faq-background");
      main?.classList.remove("gift-background");
      main?.classList.remove("about-background");

      this.isWhitePage = true;
    }
    
  }
}
