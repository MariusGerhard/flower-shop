import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bouquets',
  templateUrl: './bouquets.component.html',
  styleUrls: ['./bouquets.component.css']
})
export class BouquetsComponent implements OnInit {

  bouquets: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.bouquets = db.collection('bouquets').valueChanges();
  }
  ngOnInit() {
  }

}
