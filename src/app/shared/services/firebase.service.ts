import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';

import {UIService} from './ui.service';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {User} from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {Bouquet} from '../models/bouquet.model';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private defaultCenterColl = 'elish';
  private userColl = 'userdb';
  private eStoreColl = 'estore';
  fakeResponse = false;
  userStatus = false;
  category: string;
  flower: string;
  user: User;
  authChanged = new Subject<boolean>();
  constructor(private router: Router,
              private uiService: UIService,
              private firestore: AngularFirestore,
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
        this.router.navigate(['/shop']);
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
  async logoutUser() {
    await this.afAuth.auth.signOut();
  }
  setBouquets(columnType, data: Bouquet) {
        return this.firestore.collection(columnType).add(data);
    }
  updateBouquets(columnType, key, value) {
    console.log(columnType + key + value);
    return this.firestore.collection(columnType).doc(key).update(value);
  }
  /*
  Outdated
  getBouquet(columnType, key) {
    return this.firestore.collection('bouquet').doc(key).get();
  }
   */
  delBouquet(columnType, key) {
    return this.firestore.collection(columnType).doc(key).delete();
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
  getFilterBouquets(columnType: string, filters) {
    if (filters) {
      if (filters.name > '') {
        return this.firestore.collection(columnType, ref =>
          ref
            .where('name', '>=', filters.name)
            .orderBy('name', 'desc')
        ).snapshotChanges();
      }
      if (filters.category > '') {
        return this.firestore.collection(columnType, ref =>
          ref
            .where('category', '==', filters.category)
            .orderBy('name', 'desc')
        ).snapshotChanges();
      }
      if (filters.flower > '')  {
        return this.firestore.collection(columnType, ref =>
          ref
            .where('flower', '==', filters.flower)
            .orderBy('name', 'desc')
        ).snapshotChanges();
      }
    } else {
      return this.firestore.collection(columnType).snapshotChanges();
    }
  }
  getBouquets(columnType) {
    return this.firestore.collection(columnType).snapshotChanges();
  }
}
