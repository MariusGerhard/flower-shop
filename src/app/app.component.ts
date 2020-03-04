import {Component, OnChanges, OnInit} from '@angular/core';
import {FirebaseService} from './shared/services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {
  constructor(private firebaseService: FirebaseService) { }
  ngOnInit() {
    this.firebaseService.initAuthListener();
  }
  ngOnChanges() {
  }
}
