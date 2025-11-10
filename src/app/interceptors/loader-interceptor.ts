// src/app/interceptors/loader.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Auth } from '../core/services/auth';
import { NgxSpinnerService } from 'ngx-spinner';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(Auth);
  // NgxSpinnerService is optional here but used to show the visual spinner provided by ngx-spinner
  let spinner: NgxSpinnerService | null = null;
  try {
    spinner = inject(NgxSpinnerService);
  } catch (e) {
    // ignore if spinner service isn't available in the injector
    spinner = null;
  }

  loaderService.show();
  if (spinner) {
    // show the default spinner (no name)
    try { spinner.show(); } catch { /* swallow errors */ }
  }

  return next(req).pipe(
    finalize(() => {
      loaderService.hide();
      if (spinner) {
        try { spinner.hide(); } catch { /* swallow errors */ }
      }
    })
  );
};