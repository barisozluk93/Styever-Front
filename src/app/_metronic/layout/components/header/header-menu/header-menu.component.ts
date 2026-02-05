import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuModel } from 'src/app/models/menu.model';
import { AuthService } from 'src/app/modules/auth';

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


@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {

  menuList: MenuModel[] = menuList;
  permissionList: number[] | undefined;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
      this.authService.currentUserSubject.asObservable().subscribe(result => {
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
      })
  }

  calculateMenuItemCssClass(url: string): string {
    return checkIsActive(this.router.url, url) ? 'active' : '';
  }
}

const getCurrentUrl = (pathname: string): string => {
  return pathname.split(/[?#]/)[0];
};

const checkIsActive = (pathname: string, url: string) => {
  const current = getCurrentUrl(pathname);
  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
};
