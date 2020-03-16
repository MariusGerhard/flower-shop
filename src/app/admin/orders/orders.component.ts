import {Component, OnDestroy, OnInit} from '@angular/core';
import {fallIn, moveIn} from '../../router.animations';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [moveIn(), fallIn()],
})
export class OrdersComponent implements OnInit, OnDestroy {
  state: string;
  isLoading = false;
  toggleMode: string;
  private querySubscription;
  constructor() {
    this.toggleMode = 'searchMode';
  }

  ngOnInit() {
  }
  toggle(filter?) {
    if (!filter) {
      filter = 'searchMode';
    }
    this.toggleMode = filter;
  }
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
