import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuModel } from 'src/app/models/menu.model';
import { AuthService } from 'src/app/modules/auth';
import { Subject, takeUntil } from 'rxjs';
import { AdminModeService } from '../../../services/admin-mode.service';

const siteMenuList: MenuModel[] = [
  { id: 1, name: 'Hakkında', nameEn: 'About', url: '/about', isDeleted: false, isSystemData: true, childMenus: [], isForbid: false },
  { id: 2, name: 'Anı Ekleyin', nameEn: 'Add Memory', url: '/memories', isDeleted: false, isSystemData: true, childMenus: [], isForbid: false },
  { id: 3, name: 'Yanında Ol', nameEn: 'Gift Voucher', url: '/giftvoucher', isDeleted: false, isSystemData: true, childMenus: [], isForbid: false },
  { id: 4, name: 'Destek Köşesi', nameEn: 'Support', url: '/support', isDeleted: false, isSystemData: true, childMenus: [], isForbid: false },
  { id: 5, name: 'Sıkça Sorulan Sorular', nameEn: 'FAQs', url: '/faq', isDeleted: false, isSystemData: true, childMenus: [], isForbid: false },
];

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
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit, OnDestroy {
  menuList: MenuModel[] = siteMenuList;
  isAdminMode = false;
  permissionList: number[] | undefined;
  openedMenuId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminModeService: AdminModeService
  ) {}

  ngOnInit(): void {
    this.adminModeService.adminMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAdminMode) => {
        this.isAdminMode = isAdminMode;
        this.menuList = isAdminMode ? adminMenuList : siteMenuList;
        this.openedMenuId = null;
        this.applyPermissions();
      });

    this.authService.currentUserSubject
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result?.permissions) {
          this.permissionList = JSON.parse(result.permissions) as number[];
          this.applyPermissions();
        }
      });
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.openedMenuId = null;
  }

  toggleDropdown(menuId: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.openedMenuId = this.openedMenuId === menuId ? null : menuId;
  }

  isChildMenuActive(menu: MenuModel): boolean {
    return !!menu.childMenus?.some(child => this.calculateMenuItemCssClass(child.url) === 'active');
  }

  getFallbackIcon(index: number): string {
    return ['bi-info-circle', 'bi-plus-circle', 'bi-gift', 'bi-file-earmark-text', 'bi-question-circle'][index] || 'bi-grid';
  }

  getChildDescription(id: number): string {
    const isTr = document.documentElement.lang === 'tr' || localStorage.getItem('language') === 'tr';
    const descriptions: Record<number, [string, string]> = {
      1021: ['Erişim yetkilerini yönetin', 'Manage access permissions'],
      1022: ['Rol ve yetki gruplarını yönetin', 'Manage roles and permission groups'],
      1023: ['Kullanıcı hesaplarını yönetin', 'Manage user accounts'],
    };
    const item = descriptions[id];
    return item ? (isTr ? item[0] : item[1]) : '';
  }

  private applyPermissions(): void {
    this.menuList.forEach((menu) => {
      if (menu.permissionId) {
        menu.isForbid = !this.permissionList?.includes(menu.permissionId);
        return;
      }

      if (menu.childMenus?.length) {
        menu.childMenus.forEach((childMenu) => {
          childMenu.isForbid = childMenu.permissionId
            ? !this.permissionList?.includes(childMenu.permissionId)
            : false;
        });
        menu.isForbid = !menu.childMenus.some((childMenu) => !childMenu.isForbid);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateMenuItemCssClass(url?: string): string {
    return url && checkIsActive(this.router.url, url) ? 'active' : '';
  }
}

const getCurrentUrl = (pathname: string): string => pathname.split(/[?#]/)[0];

const checkIsActive = (pathname: string, url: string): boolean => {
  const current = getCurrentUrl(pathname);
  if (!current || !url) {
    return false;
  }
  return current === url || current.startsWith(`${url}/`);
};
