import {Component, OnDestroy, OnInit} from '@angular/core';
import {fallIn, moveIn} from '../../router.animations';
import {FirebaseService} from '../../shared/services/firebase.service';
import {Order} from '../../shared/models/order.model';
import {MatTableDataSource} from '@angular/material';
import {NgForm} from '@angular/forms';

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
  dateTypes: string[] = ['PickUpDate', 'OrderDate'];
  orders: Order[];
  order: Order;
  private querySubscription;
  constructor(private firebaseService: FirebaseService) {
    this.toggleMode = 'searchMode';
  }
  ngOnInit() {
  }
  getAllOrders() {
    this.firebaseService.getOrders().subscribe(
      (res) => {
        this.orders = res.map(e => {
          return {
            _id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as Order;
        });
        this.isLoading = false;
      }
    );
  }
  getSearchOrders(form: NgForm) {
    console.log(form.value.dateTyp);
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
