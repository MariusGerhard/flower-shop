import { Component, OnInit } from '@angular/core';
import {fallIn, moveIn} from '../../router.animations';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [moveIn(), fallIn()],
})
export class OrdersComponent implements OnInit {
  state: string;
  isLoading = false;
  toggleMode: string;
  constructor() {
    this.toggleMode = 'searchMode';
  }

  ngOnInit() {
  }

}
