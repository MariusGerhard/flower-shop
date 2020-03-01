import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  fakeResponse = false;
  userStatus = false;
  constructor(private router: Router) { }

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
          this.router.navigate(['/login']).then(r => console.log('Go to Login'));
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
          console.log(this.userStatus);
          this.router.navigate(['/shop']).then(r => console.log('Go to Shop'));
        }, 1500);
      }
    );
  }
  logoutUser() {
    this.fakeResponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(this.fakeResponse);
          this.userStatus = false;
          console.log(this.userStatus);
        }, 100);
      }
    );
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
