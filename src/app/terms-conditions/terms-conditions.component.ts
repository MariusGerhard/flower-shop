import { Component, OnInit } from '@angular/core';
import {HeaderTitleService} from '../services/header-title.service';
import {fallIn, moveIn} from '../router.animations';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css'],
  animations: [moveIn(), fallIn()],
  // tslint:disable-next-line:no-host-metadata-property
  host: {'@moveIn': ''},
})
export class TermsConditionsComponent implements OnInit {
  state: string;
  isRegister = true;
  constructor(private headerTitleService: HeaderTitleService) { }

  ngOnInit() {
    this.headerTitleService.setTitle('Conditions');
  }

}
