import {Component, OnInit} from '@angular/core';
import {HeaderTitleService} from '../services/header-title.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private headerTitleService: HeaderTitleService) {
  }
  ngOnInit() {
    this.headerTitleService.setTitle('Home');
  }
}
