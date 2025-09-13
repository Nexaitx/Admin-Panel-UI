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

  login(token: string, role: string, userProfile: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
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
