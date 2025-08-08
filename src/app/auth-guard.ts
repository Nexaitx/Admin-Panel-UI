import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwtToken'); // Get the token from local storage

  // Check if the JWT token exists
  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
