import { Component, OnDestroy, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {fallIn, moveIn} from '../../router.animations';
import {HeaderTitleService} from '../../shared/services/header-title.service';
import {MatTableDataSource} from '@angular/material';
import {FirebaseService} from '../../shared/services/firebase.service';
import {AngularFireStorage} from '@angular/fire/storage';


@Component({
  selector: 'app-bouquets',
  templateUrl: './bouquets.component.html',
  styleUrls: ['./bouquets.component.css'],
  animations: [moveIn(), fallIn()],
  // tslint:disable-next-line:no-host-metadata-property
  host: {'@moveIn': ''},
})
export class BouquetsComponent implements OnInit, OnDestroy {
  // Animations
  state: string;
  isLoading =  false;
  isAuth;
  members: Observable<any>;
  // members: any;
  // members: any[];
  dataSource: MatTableDataSource<any>;
  myDocData;
  data;
  currentDate;
  currentDate7;
  toggle = true;
  savedChanges = false;
  error = false;
  errorMessage = '';
  private querySubscription;

  profileUrl: Observable<string | null>;
  takeHostSelfie = false;
  showHostSelfie = false;
  myDocId;
  counter = 0;

  bouquets: Observable<any[]>;

  constructor(db: AngularFirestore,
              private headerTitleService: HeaderTitleService,
              private firebaseService: FirebaseService,
              private storage: AngularFireStorage) {
  //  this.bouquets = db.collection('bouquets').valueChanges();
  }
  ngOnInit() {
    this.headerTitleService.setTitle('Bouquets');
  }
  getData() {
    this.members = this.firebaseService.getBouquets('bouquets');
  }
  getFilterData(filters) {
    if (filters) {
      this.members = this.firebaseService.getFilterBouquets('bouquets', filters);
    } else {
      this.getData();
    }
  }
  setData(formData) {
    this.isLoading = true;
    this.firebaseService.setBouquets('bouquets', formData).then((res) => {
      this.savedChanges = true;
      this.isLoading = false;
    }).catch(error => {
      this.error = true;
      this.errorMessage = error.message;
      this.isLoading = false;
    });
  }
  getPic(picId) {
    const ref = this.storage.ref(picId);
    this.profileUrl = ref.getDownloadURL();
  }
  addToCart(item, counter){
    this.isLoading = true;
    const data = item;
    data.qty = counter;
    return this.firebaseService.updateBouquets('bouquets', data).then((success) => {
      this.isLoading = false;
      this.savedChanges = true;
    });
  }
  showDetails(item) {
    this.counter = 0;
    this.myDocData = item;
   // this.getPic(item.path);
    // capture user interest event, user has looked into product details
    this.isLoading = true;
    const data = item;
    return this.firebaseService.getBouquets('bouquets').then((success) => {
      this.isLoading = false;
    });
  }
  countProd(filter) {
    if (filter === 'add') {
      this.counter = this.counter + 1;
    } else {
      if (this.counter > 0) {
        this.counter = this.counter - 1;
      }
    }
  }
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
