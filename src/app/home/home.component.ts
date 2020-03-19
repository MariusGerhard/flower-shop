import {Component, OnInit} from '@angular/core';
import {HeaderTitleService} from '../shared/services/header-title.service';
import {fallIn, moveIn} from '../router.animations';
import {FirebaseService} from '../shared/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [moveIn(), fallIn()],
})
export class HomeComponent implements OnInit {
  state: string;
  isAuth =  false;
  constructor(private headerTitleService: HeaderTitleService,
              private firebaseService: FirebaseService) {
  }
  ngOnInit() {
    this.headerTitleService.setTitle('Home');
    this.isAuth = this.firebaseService.isAuth();
  }
}
