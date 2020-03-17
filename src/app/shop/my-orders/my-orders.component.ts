import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fallIn, moveIn} from '../../router.animations';
import {HeaderTitleService} from '../../shared/services/header-title.service';
import {UserModel} from '../../shared/models/userModel';
import {FirebaseService} from '../../shared/services/firebase.service';
import {Order} from '../../shared/models/order.model';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  animations: [moveIn(), fallIn()],
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  state: string;
  isLoading = false;
  toggleMode: string;
  querySubscription;
  userId: string;
  users: UserModel[];
  user: UserModel = {
    authId: '',
    id: '',
    gender: '',
    firstName: '',
    lastName: '',
    email: '',
    birth: '',
  };
  orders: Order[];
  order: Order = {
    bouquetId: 0,
    bouquetName: '',
    userName: '',
    userId: '',
    pickUpDate: '',
    orderDate: '',
    price: 0
  }
  displayedColumns: string[] = ['bouquetName', 'orderDate', 'action'];
  dataSource: MatTableDataSource<Order>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(private headerTitleService: HeaderTitleService,
              private firebaseService: FirebaseService) {
    this.toggleMode = 'listMode';
  }
  ngOnInit() {
    this.headerTitleService.setTitle('My Orders');
    this.userId = this.firebaseService.getCurrentUserId();
    this.isLoading = true;
    this.getUser();
  }
  onDetails(id) {
    console.log(id);
    console.log(this.order);
  }
  toggle(filter?) {
    if (!filter) {
      filter = 'searchMode';
    }
    this.toggleMode = filter;
  }
  getUser() {
    this.querySubscription = this.firebaseService.getCurrentUser(this.userId).subscribe(
      res => {
        this.users = res.map(e => {
          return {
            authId: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as UserModel;
        });
        this.user = this.users[0];
        this.getOrders();
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  getOrders() {
    this.isLoading = true;
    this.querySubscription = this.firebaseService.getUserOrder('order', this.user.id).subscribe(
      data => {
        this.orders = data.map(e => {
          return {
            _id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as Order;
        });
        this.dataSource = new MatTableDataSource(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
