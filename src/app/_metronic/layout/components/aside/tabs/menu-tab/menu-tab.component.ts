import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import {
  DrawerComponent,
  MenuComponent,
  ScrollComponent,
  ToggleComponent,
} from 'src/app/_metronic/kt/components';
import { environment } from '../../../../../../../environments/environment';
import { AuthService } from 'src/app/modules/auth';
import { MenuModel } from 'src/app/models/menu.model';
import { AdminModeService } from '../../../../services/admin-mode.service';

const menuList = [
  {
    "id": 1,
    "name": "Hakkında",
    "nameEn": "About",
    "url": "/about",
    "icon": undefined,
    "permissionId": undefined,
    "isDeleted": false,
    "isSystemData": true,
    "parentId": undefined,
    "parent": undefined,
    "childMenus": [],
    "isForbid": false,
  },
  {
    "id": 2,
    "name": "Anı Ekleyin",
    "nameEn": "Add Memory",
    "url": "/memories",
    "icon": undefined,
    "permissionId": undefined,
    "isDeleted": false,
    "isSystemData": true,
    "parentId": undefined,
    "parent": undefined,
    "isForbid": false,
    "childMenus": [ ]
  },
  {
    "id": 3,
    "name": "Yanında Ol",
    "nameEn": "Gift Voucher",
    "url": "/giftvoucher",
    "icon": undefined,
    "permissionId": undefined,
    "isDeleted": false,
    "isSystemData": true,
    "parentId": undefined,
    "parent": undefined,
    "childMenus": [],
    "isForbid": false,
  },
  {
    "id": 4,
    "name": "Destek Köşesi",
    "nameEn": "Support",
    "url": "/support",
    "icon": undefined,
    "permissionId": undefined,
    "isDeleted": false,
    "isSystemData": true,
    "parentId": undefined,
    "parent": undefined,
    "childMenus": [],
    "isForbid": false,
  },
  {
    "id": 5,
    "name": "Sıkça Sorulan Sorular",
    "nameEn": "FAQs",
    "url": "/faq",
    "icon": undefined,
    "permissionId": undefined,
    "isDeleted": false,
    "isSystemData": true,
    "parentId": undefined,
    "parent": undefined,
    "childMenus": [],
    "isForbid": false,
  },
]

const adminMenuList: MenuModel[] = [
  {
    id: 101,
    name: 'Dashboard',
    nameEn: 'Dashboard',
    url: '/dashboard',
    icon: 'bi-speedometer2',
    permissionId: 43,
    isDeleted: false,
    isSystemData: true,
    childMenus: [],
    isForbid: false,
  },
  {
    id: 102,
    name: 'Kullanıcı Yönetimi',
    nameEn: 'User Management',
    url: '/usermanagement',
    icon: 'bi-people',
    isDeleted: false,
    isSystemData: true,
    isForbid: false,
    childMenus: [
      { id: 1021, name: 'Yetkiler', nameEn: 'Permissions', url: '/usermanagement/permissions', icon: 'bi-shield-check', permissionId: 1, isDeleted: false, isSystemData: true, isForbid: false, childMenus: [] },
      { id: 1022, name: 'Roller', nameEn: 'Roles', url: '/usermanagement/roles', icon: 'bi-person-badge', permissionId: 7, isDeleted: false, isSystemData: true, isForbid: false, childMenus: [] },
      { id: 1023, name: 'Kullanıcılar', nameEn: 'Users', url: '/usermanagement/users', icon: 'bi-person-lines-fill', permissionId: 13, isDeleted: false, isSystemData: true, isForbid: false, childMenus: [] },
    ],
  },
  {
    id: 105,
    name: 'Paketler',
    nameEn: 'Plans',
    url: '/planmanagement',
    icon: 'bi-box-seam',
    permissionId: 54,
    isDeleted: false,
    isSystemData: true,
    childMenus: [],
    isForbid: false,
  },
  {
    id: 106,
    name: 'Yasal & Topluluk',
    nameEn: 'Legal & Community',
    url: '/legalcontentmanagement',
    icon: 'bi-file-earmark-lock2',
    permissionId: 58,
    isDeleted: false,
    isSystemData: true,
    childMenus: [],
    isForbid: false,
  },
  {
    id: 103,
    name: 'Makaleler',
    nameEn: 'Articles',
    url: '/supportmanagement',
    icon: 'bi-journal-richtext',
    permissionId: 44,
    isDeleted: false,
    isSystemData: true,
    childMenus: [],
    isForbid: false,
  },
  {
    id: 104,
    name: 'Sıkça Sorulan Sorular',
    nameEn: 'FAQs',
    url: '/faqmanagement',
    icon: 'bi-question-square',
    permissionId: 49,
    isDeleted: false,
    isSystemData: true,
    childMenus: [],
    isForbid: false,
  },
];


@Component({
  selector: 'app-menu-tab',
  templateUrl: './menu-tab.component.html',
  styleUrls: ['./menu-tab.component.scss'],
})
export class MenuTabComponent implements OnInit, AfterViewInit, OnDestroy {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  @ViewChild('ktAsideScroll', { static: true }) ktAsideScroll: ElementRef;
  private unsubscribe: Subscription[] = [];
  private destroy$ = new Subject<void>();

  menuList: MenuModel[] = menuList;
  isAdminMode = false;
  permissionList: number[] | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminModeService: AdminModeService
  ) {}

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    this.routingChanges();

    this.adminModeService.adminMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAdminMode => {
        this.isAdminMode = isAdminMode;
        this.menuList = isAdminMode ? adminMenuList : menuList;
        this.menuReinitialization();
      });

    this.authService.currentUserSubject.asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
      if(result) {
        if (result?.permissions) {
          this.permissionList = (JSON.parse(result?.permissions) as number[]);

          this.menuList.forEach(menu => {
            if (menu.permissionId) {
              menu.isForbid = !this.permissionList?.includes(menu.permissionId);
            } else if (menu.childMenus?.length) {
              menu.childMenus.forEach(childMenu => {
                childMenu.isForbid = childMenu.permissionId
                  ? !this.permissionList?.includes(childMenu.permissionId)
                  : false;
              });
              menu.isForbid = !menu.childMenus.some(childMenu => !childMenu.isForbid);
            } else {
              menu.isForbid = false;
            }
          });
        }
      }
    })
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.menuReinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  menuReinitialization() {
    setTimeout(() => {
      MenuComponent.reinitialization();
      DrawerComponent.reinitialization();
      ToggleComponent.reinitialization();
      ScrollComponent.reinitialization();
      if (this.ktAsideScroll && this.ktAsideScroll.nativeElement) {
        this.ktAsideScroll.nativeElement.scrollTop = 0;
      }
    }, 50);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
