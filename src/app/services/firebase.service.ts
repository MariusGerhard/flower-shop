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
        }, 5000);
      }
    );
  }
  logoutUser() {
    console.log('Logout');
    this.fakeResponse = false;
    return true;
  }
}
