import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../../shared/services/firebase.service';
import {UserModel} from '../../shared/models/userModel';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {User} from 'firebase';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['lastName', 'role', 'counterOrders', 'id'];
  isLoading = false;
  toggleMode: string;
  users: UserModel[];
  tmp: UserModel[] = [];
  roles: string[] = [
    'User', 'Employee', 'Admin'
  ];
  private querySubscription;
  constructor(private firebaseService: FirebaseService) {
    this.toggleMode = 'searchMode';
  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  onSearch(form) {
    this.isLoading = true;
    this.tmp = [];
    this.querySubscription = this.firebaseService.getUsers().subscribe(data => {
        this.users = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as UserModel;
        });
        if (form.role) {
          this.users.forEach((res) => {
            if (res.role.toLowerCase() === form.role.toLowerCase()) {
              this.tmp.push(res);
            }
          });
        } else {
          this.users.forEach((res) => {
            if (res.countOrders >= form.counter) {
              this.tmp.push(res);
            }
          });
        }
        this.dataSource = new MatTableDataSource(this.tmp);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      }
    );
  }
  getAllUsers() {
    this.isLoading = true;
    this.querySubscription = this.firebaseService.getUsers().subscribe(data => {
       this.users = data.map(e => {
         return {
           id: e.payload.doc.id,
           ...e.payload.doc.data(),
         }as UserModel;
       });
       this.dataSource = new MatTableDataSource(this.users);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
       this.isLoading = false;
     }
   );
  }
  onGetUser(id) {
  }
  onDeleteUser(id) {}
  // data table methods
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator.firstPage();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
