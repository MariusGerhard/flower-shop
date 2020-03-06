import { Component, OnDestroy, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {fallIn, moveIn} from '../../router.animations';
import {HeaderTitleService} from '../../shared/services/header-title.service';
import {MatTableDataSource} from '@angular/material';
import {FirebaseService} from '../../shared/services/firebase.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {Bouquet} from '../../shared/models/bouquet.model';


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
  bouquets: Bouquet[];

//  bouquets: Observable<any[]>;

  constructor(db: AngularFirestore,
              private headerTitleService: HeaderTitleService,
              private firebaseService: FirebaseService,
              private storage: AngularFireStorage) {
  //  this.bouquets = db.collection('bouquets').valueChanges();
  }
  ngOnInit() {
    this.headerTitleService.setTitle('Bouquets');
    this.querySubscription = this.firebaseService.getBouquets('bouquets').subscribe(data => {
        this.bouquets = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as Bouquet;
        });
      }
    );
  }
  getFilterData(filters) {
    if (filters) {
      this.members = this.firebaseService.getFilterBouquets('bouquets', filters);
    } else {
    }
  }
  setData(formData) {
    this.firebaseService.setBouquets('bouquets', formData);
  }
  getPic(picId) {
    const ref = this.storage.ref(picId);
    this.profileUrl = ref.getDownloadURL();
  }
  /*
  addToCart(item, counter){
    this.isLoading = true;
    const data = item;
    data.qty = counter;
    return this.firebaseService.updateBouquets('bouquets', data).then((success) => {
      this.isLoading = false;
      this.savedChanges = true;
    });
  }
   */
  showDetails(item) {
    this.counter = 0;
    this.myDocData = item;
   // this.getPic(item.path);
    // capture user interest event, user has looked into product details
    this.isLoading = true;
    const data = item;
    return this.firebaseService.getBouquets('bouquets');
    this.isLoading = false;
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
