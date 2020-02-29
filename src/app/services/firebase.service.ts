import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  fakeResponse = false;
  constructor() { }

  getUserStatus() {
    this.fakeResponse = true;
    return Observable.create(
      observer => {
        setTimeout(() => {
          observer.next(this.fakeResponse);
        }, 2000);
      }
    );
  }
  logoutUser() {
    console.log('Logout');
    this.fakeResponse = false;
    return true;
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
    const fakeResponse = [{
      name: 'wurst',
      price: 'wurst',
      seasonStart: '5'
    }];
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
