import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {FirebaseService} from '../shared/services/firebase.service';
import {UIService} from '../shared/services/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService, private router: Router, private uiService: UIService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.firebaseService.isAuth()) {
      return true;
    }
    /*
    this.router.navigate(['/login']).then(
      () => {
        this.uiService.showSnackbar('Please Login first', null, 2000);
      });
     */
  }
}
