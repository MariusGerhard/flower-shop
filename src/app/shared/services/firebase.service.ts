import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';

import {UIService} from './ui.service';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {User} from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {Bouquet} from '../models/bouquet.model';
import {UserModel} from '../models/userModel';
import {Order} from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  fakeResponse = false;
  private userStatus = false;
  private isAdmin = true;
  category: string;
  flower: string;
  private newUser: UserModel;
  private currentUserId: string;
  private user: User;
  authChanged = new Subject<boolean>();
  constructor(private router: Router,
              private uiService: UIService,
              private firestore: AngularFirestore,
              private afAuth: AngularFireAuth) { }
  isAuth() {
    return this.userStatus;
  }
  checkAdmin() {
    return this.isAdmin;
  }
  getCurrentUserId() {
    return this.currentUserId;
  }
  getCurrentUser(authId) {
    return this.firestore.collection('user', ref =>
      ref
        .where('authId', '==', authId)
    ).snapshotChanges();
  }
  async initAuthListener() {
     this.afAuth.authState.subscribe(user => {
      if ( user) {
        this.user = user;
        this.currentUserId = user.uid;
        this.userStatus = true;
        this.authChanged.next(true);
        this.router.navigate(['/shop']);
      } else {
        this.userStatus = false;
        this.authChanged.next(false);
        this.router.navigate(['']);
      }
    });
  }
  async registerUser(authData) {
    await this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(
      (res) => {
        this.newUser = {
          id: res.user.uid,
          authId: res.user.uid,
          gender: authData.gender,
          firstName: authData.firstName,
          lastName: authData.lastName,
          email: authData.email,
          birth: authData.birth,
          role: 'user',
          countOrders: 0,
        };
        this.uiService.showSnackbar('Account created. Login successful', null, 1500);
      })
      .catch(err => {
        console.log(err);
      });
    await console.log('end', this.newUser);
    await this.setUser(this.newUser);
  }
  async sendPasswordResetEmail(passwordResetEmail: string) {
    await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
    await this.router.navigate(['login']).then(() => console.log('Password reset success'));
  }
  async loginUser(loginData) {
    this.afAuth.auth.signInWithEmailAndPassword(loginData.email, loginData.password).then(
      (res) => {
        this.currentUserId = res.user.uid;
        this.uiService.showSnackbar('Login successful', null, 1500);
      })
      .catch(err => {
        this.userStatus = false;
        console.log(err);
      })
      .finally( () => {
        }
      );
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
    this.currentUserId = '';
    await this.afAuth.auth.signOut();
  }
  setUser(userData: UserModel) {
      this.currentUserId = userData.id;
      return this.firestore.collection('user').add(userData);
  }
  updateUser(columnType, key, value) {
    return this.firestore.collection(columnType).doc(key).update(value);
  }
  setBouquets(columnType, data: Bouquet) {
        return this.firestore.collection(columnType).add(data);
    }
  updateBouquets(columnType, key, value) {
    console.log(key);
    console.log(value._id);
    return this.firestore.collection(columnType).doc(key).update(value);
  }
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
  getUsers() {
    return this.firestore.collection('user').snapshotChanges();
  }
  getUserOrder(columnType: string, filter) {
    return this.firestore.collection(columnType, ref =>
      ref
        .where('userId', '==', filter)
        .orderBy('orderDate', 'desc')
    ).snapshotChanges();
  }
  getOrders() {
    return this.firestore.collection('order').snapshotChanges();
  }
  setOrder(columnType, data: Order) {
    return this.firestore.collection(columnType).add(data);
  }
}
