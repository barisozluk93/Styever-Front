import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { MemoryManagementService } from '../../memory/memory-management.service';
import { parseBoolean } from 'src/app/utils/parse-boolean';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router, private memoryManagementService: MemoryManagementService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      if (state.url.includes('memories/new')) {
        if (this.authService.getAuthFromLocalStorage()?.isPaymentRequired) {
          this.router.navigate(['/payment']);
          return false;
        }
        else {
          if(!parseBoolean(currentUser.isActive)) {
            this.router.navigate(['/memories']);
            return false;
          }
          else{
            this.memoryManagementService.getMemoryCount(currentUser?.id).subscribe(result => {
              if (result.isSuccess) {
                if (currentUser?.roles.includes("2") || currentUser?.roles.includes("3")) {
                  if (result.data >= 1) {
                    this.router.navigate(['/memories']);
                    return false;
                  }
                  else {
                    return true;
                  }
                }
                else if (currentUser?.roles.includes("4")) {
                  if (result.data >= 4) {
                    this.router.navigate(['/memories']);
                    return false;
                  }
                  else {
                    return true;
                  }
                }
                else {
                  return true;
                }
              }
              else {
                this.router.navigate(['/memories']);
                return false;
              }
            })
          }
        }
      }
      else if (state.url.includes('memories/edit')) {
        if (this.authService.getAuthFromLocalStorage()?.isPaymentRequired) {
          this.router.navigate(['/payment']);
          return false;
        }
        else{
          var memoryId = parseInt(state.url.split('/')[state.url.split('/').length - 1]);
          
          if(!parseBoolean(currentUser.isActive)) {
            this.router.navigate(['/memories/' + memoryId]);
            return false;
          }
          else{
            this.memoryManagementService.getById(memoryId).subscribe(result => {
              if (result.isSuccess) { 
                if(result.data.userId != currentUser?.id || result.data.belongingToOldPackage){
                  this.router.navigate(['/memories/' + memoryId]);
                  return false;
                }
                else{
                  return true;
                }
              }
              else{
                this.router.navigate(['/memories/' + memoryId]);
                return false;
              }
            });
          }
        }
      }

      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
    return false;
  }
}
