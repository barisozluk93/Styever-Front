import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const user = this.authService.currentUserValue;
    if (!user) {
      return this.router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
    }

    const permissionId = Number(route.data?.['permissionId']);
    if (!permissionId) {
      return true;
    }

    let permissions: number[] = [];
    try {
      permissions = user.permissions ? (JSON.parse(user.permissions) as number[]) : [];
    } catch {
      permissions = [];
    }

    return permissions.includes(permissionId) ? true : this.router.createUrlTree(['/home']);
  }
}
