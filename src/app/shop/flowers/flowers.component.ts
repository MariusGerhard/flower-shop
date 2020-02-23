import {Component, OnChanges, OnInit} from '@angular/core';
import {HeaderTitleService} from '../../services/header-title.service';
import {fallIn, moveIn} from '../../router.animations';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-flowers',
  templateUrl: './flowers.component.html',
  styleUrls: ['./flowers.component.css'],
  animations: [moveIn(), fallIn()],
  // tslint:disable-next-line:no-host-metadata-property
  host: {'@moveIn': ''},
})
export class FlowersComponent implements OnInit, OnChanges {
  state: string;
  flowers: Observable<any[]>;
  constructor(db: AngularFirestore, private headerTitleService: HeaderTitleService) {
    this.flowers = db.collection('flowers').valueChanges();
  }

  ngOnInit() {
    this.headerTitleService.setTitle('Custom');
  }
  ngOnChanges() {
  }

}
