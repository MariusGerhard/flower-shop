import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';

import {UIService} from './ui.service';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {User} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  fakeResponse = false;
  userStatus = false;
  user: User;
  authChanged = new Subject<boolean>();
  constructor(private router: Router,
              private uiService: UIService,
              private afAuth: AngularFireAuth) { }
  isAuth() {
    return this.userStatus;
  }
  async initAuthListener() {
     this.afAuth.authState.subscribe(user => {
      if ( user) {
        this.user = user;
        this.userStatus = true;
        this.authChanged.next(true);
        this.uiService.showSnackbar('Login successful', null, 1500);
        this.router.navigate(['/shop']).then(r => console.log('rooted to shop'));
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        this.userStatus = false;
        this.authChanged.next(false);
        this.router.navigate(['']).then(r => console.log('Logout'));
        localStorage.setItem('user', null);
      }
    });
  }
  async registerUser(authData) {
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(
      () => {
        this.uiService.showSnackbar('Account created. Login successful', null, 1500);
      })
      .catch(err => {
        console.log(err);
      });
  }
  async sendPasswordResetEmail(passwordResetEmail: string) {
    await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
    this.router.navigate(['login']).then(() => console.log('Password reset success'));
  }
  async loginUser(loginData) {
    this.afAuth.auth.signInWithEmailAndPassword(loginData.email, loginData.password).then(
      () => {
      })
      .catch(err => {
        this.userStatus = false;
        console.log(err);
      });
  }
  async loginGoogle() {
    await this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
}
  async loginFacebook() {
    await this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }
  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification();
    await this.router.navigate(['admin/verify-email']);
  }
  logoutUser() {
    this.afAuth.auth.signOut().then(() => console.log('Logout'));
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
