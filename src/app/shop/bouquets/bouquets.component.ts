import { Component, OnDestroy, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {fallIn, moveIn} from '../../router.animations';
import {HeaderTitleService} from '../../shared/services/header-title.service';
import {MatTableDataSource} from '@angular/material';
import {FirebaseService} from '../../shared/services/firebase.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {Bouquet} from '../../shared/models/bouquet.model';
import {Order} from '../../shared/models/order.model';
import {UserModel} from '../../shared/models/userModel';
import {UIService} from '../../shared/services/ui.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-bouquets',
  templateUrl: './bouquets.component.html',
  styleUrls: ['./bouquets.component.css'],
  animations: [moveIn(), fallIn()],
})
export class BouquetsComponent implements OnInit, OnDestroy {
  // Animations
  state: string;
  isLoading =  false;
  min: Date;
  max: Date;
  data;
  isExtra = false;
  isMessage = false;
  currentDate;
  currentDate7;
  savedChanges = false;
  error = false;
  errorMessage = '';
  private querySubscription;
  dataSource = new MatTableDataSource();

  profileUrl: Observable<string | null>;
  takeHostSelfie = false;
  showHostSelfie = false;
  counter = 5;
  bouquets: Bouquet[];
  bouquet: Bouquet;
  toggleMode: string;
  order: Order;
  pickupDate: Date;
  orderDate: Date;
  events: string[];
  userId: string;
  saveId: string;
  users: UserModel[];
  user: UserModel = {
    authId: '',
    id: '',
    gender: '',
    firstName: '',
    lastName: '',
    email: '',
    birth: '',
  };
  constructor(db: AngularFirestore,
              private headerTitleService: HeaderTitleService,
              private firebaseService: FirebaseService,
              private storage: AngularFireStorage,
              private uiService: UIService,
              private router: Router) {
    this.events = ['Birthday', 'Mothers Day', 'Christmas', 'Easter'];
    this.userId = this.firebaseService.getCurrentUserId();
    this.pickupDate = new Date();
    this.orderDate = new Date();
    this.toggleMode = 'searchMode';
    this.order = {
      userId: 'UserID',
      userName: 'UserName',
      bouquetId: 12,
      bouquetName: 'BouquetName',
      price: 12.0,
      orderDate: this.orderDate.toDateString(),
      pickUpDate: this.orderDate.toDateString(),
      message: '',
      event: '',
    };
  }
  ngOnInit() {
    this.headerTitleService.setTitle('Bouquets');
    this.max = new Date();
    this.min = new Date();
    this.min.setDate(this.min.getDate() + 1);
    this.max.setDate(this.max.getDate() + 21);
    this.isLoading = true;
    this.querySubscription = this.firebaseService.getBouquets('bouquets').subscribe(data => {
        this.bouquets = data.map(e => {
          return {
            _id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as Bouquet;
          this.isLoading = false;
        });
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      },
      () => {
        this.isLoading = false;
      }
    );
    this.querySubscription = this.firebaseService.getCurrentUser(this.userId).subscribe(
      res => {
        this.users = res.map(e => {
          this.saveId = e.payload.doc.id;
          return {
            authId: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as UserModel;
        });
        this.users[0].id = this.saveId;
        this.user = this.users[0];
        this.counter = this.user.countOrders;
        this.isLoading = false;
        this.order.userName = this.user.firstName + ' ' + this.user.lastName;
        this.order.userId = this.user.id;
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  toggle(filter?) {
    if (!filter) {
      filter = 'searchMode';
    }
    this.toggleMode = filter;
  }
  onOrder() {
    console.log(this.order);
    this.isLoading = true;
    this.firebaseService.setOrder('order', this.order).then(
      () => {
        this.uiService.showSnackbar('Your order of ' + this.order.bouquetName + ' was successful' , null, 2500);
        this.router.navigate(['/shop']);
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      });
    // update user counter
    this.user.countOrders = this.user.countOrders + 1;
    this.firebaseService.updateUser('user', this.user.id, this.user).then(() => this.isLoading = false);
  }
  onDetails(id) {
    this.bouquet = this.bouquets.find(x => x._id === id);
    this.order.bouquetName = this.bouquet.name;
    this.order.price = this.bouquet.price;
    this.order.bouquetId = this.bouquet._id;
  }
  getPic(picId) {
    const ref = this.storage.ref(picId);
    this.profileUrl = ref.getDownloadURL();
  }
  setExtras() {
    if (this.order.event !== '' && this.isExtra === false) {
      this.order.price = parseFloat(this.order.price.toString()) + 2.50;
      this.isExtra = true;
    }
    if (this.order.message !== '' && this.isMessage === false) {
      this.order.price = parseFloat(this.order.price.toString()) + 3.00;
      this.isMessage = true;
    }
    if ((this.order.event === undefined || this.order.event === '') && this.isExtra === true) {
      this.order.price = parseFloat(this.order.price.toString()) - 2.50;
      this.isExtra = false;
    }
    if (this.order.message === '' && this.isMessage === true) {
      this.order.price = parseFloat(this.order.price.toString()) - 3.00;
      this.isMessage = false;
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
