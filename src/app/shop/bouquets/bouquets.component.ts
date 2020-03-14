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
  members: Observable<any>;
  isDetail = false;
  myDocData;
  data;
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
  counter = 0;
  bouquets: Bouquet[];
  bouquet: Bouquet;
  toggleMode: string;
  constructor(db: AngularFirestore,
              private headerTitleService: HeaderTitleService,
              private firebaseService: FirebaseService,
              private storage: AngularFireStorage) {
    this.toggleMode = 'searchMode';
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
  toggle(filter?) {
    if (!filter) {
      filter = 'searchMode';
    }
    this.toggleMode = filter;
  }
  getData() {
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
  onOrder() {
    console.log('ordered');
  }
  onDetails(id) {
    this.bouquet = this.bouquets.find(x => x._id === id);
  }
  onExtras() {
  }
  getFilterData(filters) {
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
