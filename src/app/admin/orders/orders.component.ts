import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fallIn, moveIn} from '../../router.animations';
import {FirebaseService} from '../../shared/services/firebase.service';
import {Order} from '../../shared/models/order.model';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Bouquet} from '../../shared/models/bouquet.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [moveIn(), fallIn()],
})
export class OrdersComponent implements OnInit, OnDestroy {
  state: string;
  bouquet: Bouquet = {
    _id: '',
    name: '',
    category: '',
    description: '',
    seasonEnd: 12,
    seasonStart: 1,
    flower: '',
    price: 0,
  };
  bouquets: Bouquet[];
  isLoading = false;
  toggleMode: string;
  dateTypes: string[] = ['PickUpDate', 'OrderDate'];
  dateType: string;
  selectedOption: string;
  orders: any;
  order: any;
  isSearch: false;
  nextDay: Date;
  private querySubscription;
  private bouquetSubscription;
  displayedColumns: string[] = ['bouquetName', 'orderDate', 'action'];
  dataSource: MatTableDataSource<Order>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(private firebaseService: FirebaseService) {
    this.toggleMode = 'searchMode';
    this.selectedOption = 'PickUpDate';
  }
  ngOnInit() {
    if (!this.isSearch) {
      this.getAllOrders();
    }
  }
  getAllOrders() {
    this.isSearch = false;
    this.isLoading = true;
    this.firebaseService.getOrders().subscribe(
      (res) => {
        this.orders = res.map(e => {
          return {
            _id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as Order;
        });
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      }
    );
  }
  getSearchOrders(form) {
    console.log(form.dateType);
    console.log(form.picker.toDateString());
    this.isLoading = true;
    this.firebaseService.getOrdersByStartDate(form.picker.toDateString(), form.dateType).subscribe(
      (res) => {
        this.orders = res.map(e => {
          return {
            _id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as Order;
        });
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      }
    );
  }
  onNextDayOrders() {
    this.nextDay = new Date();
    this.nextDay.setDate(this.nextDay.getDate() + 1);
    this.isLoading = true;
    this.firebaseService.getOrdersByDate(this.nextDay.toDateString()).subscribe(
      (res) => {
        this.orders = res.map(e => {
          return {
            _id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as Order;
        });
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      }
    );
  }
  toggle(filter?) {
    if (!filter) {
      filter = 'searchMode';
    }
    this.toggleMode = filter;
  }
  onDetails(id) {
    this.order = this.orders.find( x => x._id === id);
    this.bouquetSubscription = this.firebaseService.getBouquet(this.order.bouquetId).subscribe(
      (res) => {
        this.bouquets = res.map(e => {
          return {
            _id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as Bouquet;
        });
        this.bouquet = this.bouquets[0];
      });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
