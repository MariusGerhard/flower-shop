import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';

import {UIService} from './ui.service';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {User} from 'firebase';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Bouquet} from '../models/bouquet.model';
import {UserModel} from '../models/userModel';
import {Order} from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  fakeResponse = false;
  private userStatus = false;
  private userRole: string;
  category: string;
  flower: string;
  users: UserModel[];
  private currentUser: UserModel;
  private querySubscription;
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
  getUserRole() {
    return this.userRole;
  }
  getCurrentUserData() {
    return this.currentUser;
  }
  checkUser() {
    this.querySubscription = this.getCurrentUser(this.currentUserId).subscribe(
      res => {
        this.users = res.map(e => {
          return {
            ...e.payload.doc.data(),
          }as UserModel;
        });
        this.currentUser = this.users[0];
        if (this.currentUser === undefined) {
          console.log('Your account was disabled');
          this.logoutUser();
          this.uiService.showSnackbar('Login disabled', null, 1500);
        } else {
          this.userRole = this.currentUser.role;
          this.uiService.showSnackbar('User was successful', null, 1500);
        }
      }
    );
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
        this.checkUser();
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
    const provider = new firebase.auth.GoogleAuthProvider();
    const credentials = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserLogin(credentials.user);
  }
  updateUserLogin(user) {
    console.log(user);
    const userRef: AngularFirestoreDocument<UserModel> = this.firestore.doc('user/' + user.uid);
    this.newUser = {
      authId: user.uid,
      firstName: user.displayName.split(' ')[0],
      lastName: user.displayName.split(' ')[1],
      email: user.email,
      id: user.uid,
    };
    console.log(this.newUser);
    userRef.set(this.newUser, {merge: true}).then();
}
  async loginFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    const credentials =  await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserLogin(credentials.user);
  }
  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification();
    await this.router.navigate(['admin/verify-email']);
  }
  async logoutUser() {
    this.currentUserId = '';
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    await this.router.navigate(['']);
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
    return this.firestore.collection(columnType).doc(key).update(value);
  }
  delBouquet(columnType, key) {
    return this.firestore.collection(columnType).doc(key).delete();
  }
  delUser(columnType, key) {
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
  getBouquet(id) {
    return this.firestore.collection('bouquets', ref =>
      ref
        .where('_id', '==', id)
    ).snapshotChanges();
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
  getOrdersByDate(date) {
    return this.firestore.collection('order', ref =>
      ref
        .where('pickUpDate', '==', date)
    ).snapshotChanges();
  }
  getOrdersByStartDate(startDate, dateTyp) {
    console.log(new Date (startDate));
    console.log(dateTyp);
    if (dateTyp === 'PickUpDate') {
      console.log('pick');
      return this.firestore.collection('order', ref =>
        ref
          .where('pickUpDate', '>=', startDate)
          .orderBy('pickUpDate', 'desc')
      ).snapshotChanges();
    } else {
      return this.firestore.collection('order', ref =>
        ref
          .where('orderDate', '>=', startDate)
          .orderBy('orderDate', 'desc')
      ).snapshotChanges();
    }
  }
  getOrders() {
    return this.firestore.collection('order').snapshotChanges();
  }
  setOrder(columnType, data: Order) {
    return this.firestore.collection(columnType).add(data);
  }
  setProductPic(filePath, fileUrl, docId) {

  }
}
