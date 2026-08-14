import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const user = this.authService.currentUserValue;

    // Login değilse
    if (!user) {
      return this.router.createUrlTree(
        ['/auth/login'],
        {
          queryParams: {
            returnUrl: state.url
          }
        }
      );
    }

    const isAdmin = user.roles.includes('1');

    if (!isAdmin) {
      // Admin değilse ana sayfaya gönder
      return this.router.createUrlTree(['/home']);
    }

    return true;
  }
}