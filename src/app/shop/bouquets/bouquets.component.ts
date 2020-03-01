import { Component, OnDestroy, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {fallIn, moveIn} from '../../router.animations';
import {HeaderTitleService} from '../../services/header-title.service';


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
  bouquets: Observable<any[]>;

  constructor(db: AngularFirestore, private headerTitleService: HeaderTitleService) {
    this.bouquets = db.collection('bouquets').valueChanges();
  }
  ngOnInit() {
    this.headerTitleService.setTitle('Bouquets');
  }
  ngOnDestroy() {}
}
