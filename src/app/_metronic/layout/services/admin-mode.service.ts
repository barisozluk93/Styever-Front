import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminModeService {
  private readonly adminModeSubject = new BehaviorSubject<boolean>(false);

  readonly adminMode$ = this.adminModeSubject.asObservable();

  get isAdminMode(): boolean {
    return this.adminModeSubject.value;
  }

  setAdminMode(value: boolean): void {
    this.adminModeSubject.next(value);
  }

  toggleAdminMode(): void {
    this.setAdminMode(!this.isAdminMode);
  }

  reset(): void {
    this.setAdminMode(false);
  }
}
