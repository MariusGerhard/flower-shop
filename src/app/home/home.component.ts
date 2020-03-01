import {Component, OnInit} from '@angular/core';
import {HeaderTitleService} from '../shared/services/header-title.service';
import {fallIn, moveIn} from '../router.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [moveIn(), fallIn()],
  // tslint:disable-next-line:no-host-metadata-property
  host: {'@moveIn': ''},
})
export class HomeComponent implements OnInit {
  state: string;
  constructor(private headerTitleService: HeaderTitleService) {
  }
  ngOnInit() {
    this.headerTitleService.setTitle('Home');
  }
}
