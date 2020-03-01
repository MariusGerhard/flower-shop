import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';

import {UIService} from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  fakeResponse = false;
  userStatus = false;
  authChanged = new Subject<boolean>();
  constructor(private router: Router,
              private uiService: UIService) { }
  isAuth() {
    return this.userStatus;
  }
  getUserStatus() {
    this.fakeResponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(this.userStatus);
        }, 5);
      }
    );
  }
  registerUser(formUser) {
    this.fakeResponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(this.fakeResponse);
          this.router.navigate(['/login']).then(
            r => this.uiService.showSnackbar('Registration completed', null, 2500));
        }, 3000);
      }
    );
  }
  loginUser(userForm) {
    this.fakeResponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(this.fakeResponse);
          this.userStatus = true;
          this.authChanged.next(this.userStatus);
          this.router.navigate(['/shop']).then(
            r => this.uiService.showSnackbar('Login completed', null, 2500));
        }, 1500);
      }
    );
  }
  logoutUser() {
    this.userStatus = false;
    this.authChanged.next(false);
    this.router.navigate(['']).then(r => console.log('Logout'));
    /*
    this.fakeResponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(this.fakeResponse);
          this.userStatus = false;
          this.authChanged.next(this.userStatus);
          console.log(this.userStatus);
        }, 100);
      }
    );
    */
  }
  setBouquets(columnType, wurst) {
    this.fakeResponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(this.fakeResponse);
        }, 2000);
      }
    );
  }
  updateBouquets(columnType, wurst) {
    this.fakeResponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(this.fakeResponse);
        }, 2000);
      }
    );
  }
  getBouquet(columnType, id) {
    const fakeResponse = {
      _id: 123,
      name: 'Schinkenwurst',
      category: 'Wurst',
      price: 12,
      seasonStart: 5,
      seasonEnd: 8,
      flower: 'rose',
      description: 'roses are are red'
    };
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(fakeResponse);
        }, 2000);
      }
    );
  }
  delBouquet(columnType, id) {
    this.fakeResponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(this.fakeResponse);
        }, 2000);
      }
    );
  }
  delBouquetPic(wurst, wurst2) {
    this.fakeResponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(this.fakeResponse);
        }, 2000);
      }
    );
  }
  getFilterBouquets(columnType, filters) {
    const fakeResponse = [{
      name: 'filter',
      category: 'filtercat',
      price: 'filter2',
      seasonStart: '2'
    }];
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(fakeResponse);
        }, 2000);
      }
    );
  }
  getBouquets(columnType) {
    const fakeResponse = [{
      name: 'testName',
      category: 'testcat',
      price: 'testPrice',
      seasonStart: '1'
    }];
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(fakeResponse);
        }, 2000);
      }
    );
  }
}
