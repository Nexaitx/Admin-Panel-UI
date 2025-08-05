// src/app/interceptors/loader.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Auth } from '../core/services/auth';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(Auth);

  loaderService.show();

  return next(req).pipe(
    finalize(() => loaderService.hide())
  );
};