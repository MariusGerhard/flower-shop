import { Component, OnInit } from '@angular/core';
import {fallIn, moveIn} from '../../router.animations';
import {HeaderTitleService} from '../../shared/services/header-title.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  animations: [moveIn(), fallIn()],
})
export class MyOrdersComponent implements OnInit {
  state: string;
  isLoading = false;
  constructor(private headerTitleService: HeaderTitleService) { }

  ngOnInit() {
    this.headerTitleService.setTitle('My Orders');
  }

}
