import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private isLoading = new BehaviorSubject<boolean>(false);
  public loading$ = this.isLoading.asObservable();

  constructor() { }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  login(token: string, permissions: string[], userProfile: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('permissions', JSON.stringify(permissions));
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userProfile');
  }

   show() {
    this.isLoading.next(true);
  }

  hide() {
    this.isLoading.next(false);
  }
}
