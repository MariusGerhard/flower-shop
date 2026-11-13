import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { FirebaseService } from '../shared/services/firebase.service';
import { UiService } from '../shared/services/ui.service';

/** Only lets logged-in users through; others are sent to the login page. */
export const authGuard: CanActivateFn = async () => {
  const firebase = inject(FirebaseService);
  const router = inject(Router);
  const ui = inject(UiService);

  await firebase.authReady;
  if (firebase.isAuth()) {
    return true;
  }
  ui.notify('auth.pleaseLogin');
  return router.createUrlTree(['/login']);
};
