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
import { Subscription } from 'rxjs';
import {
  DrawerComponent,
  MenuComponent,
  ScrollComponent,
  ToggleComponent,
} from 'src/app/_metronic/kt/components';
import { environment } from '../../../../../../../environments/environment';
import { AuthService } from 'src/app/modules/auth';
import { MenuModel } from 'src/app/models/menu.model';

const menuList = [
  {
    "id": 1,
    "name": "Anasayfa",
    "nameEn": "Home",
    "url": "/home",
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
    "name": "Anılar",
    "nameEn": "Memories",
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
    "name": "Bize Ulaşın",
    "nameEn": "Contact Us",
    "url": "/contactus",
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
    "id": 3,
    "name": "Psikolojik Destek",
    "nameEn": "Psychological Support",
    "url": "/articles",
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

  menuList: MenuModel[] = menuList;
  permissionList: number[] | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    this.routingChanges();

    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if(result) {
        if (result?.permissions) {
          this.permissionList = (JSON.parse(result?.permissions) as number[]);

          this.menuList.forEach(menu => {
            if (menu.permissionId) {
              if (this.permissionList?.includes(menu.permissionId)) {
                menu.isForbid = false;
              }
              else {
                menu.isForbid = true;
              }
            }
            else {
              menu.childMenus?.forEach(childMenu => {
                if (this.permissionList?.includes(childMenu.permissionId!)) {
                  childMenu.isForbid = false;
                  menu.isForbid = false;
                }
                else {
                  childMenu.isForbid = true;
                }

                if(!childMenu.isForbid) {
                  menu.isForbid = false;
                }
                else {
                  menu.isForbid = true;
                }
              })
            }
          })
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
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
