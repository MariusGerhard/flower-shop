import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FirebaseService} from '../../shared/services/firebase.service';
import {UserModel} from '../../shared/models/userModel';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {User} from 'firebase';
import {UIService} from '../../shared/services/ui.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  state: string;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['lastName', 'role', 'counterOrders', 'id'];
  isLoading = false;
  toggleMode: string;
  user: UserModel;
  users: UserModel[];
  tmp: UserModel[] = [];
  updateRoles: string[] = ['User', 'Employee'];
  roles: string[] = [
    'User', 'Employee', 'Admin'
  ];
  private querySubscription;
  constructor(private firebaseService: FirebaseService,
              private uiService: UIService) {
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
    this.user = this.users.find(x => x .id === id);
  }
  onChangeRole(role) {
    console.log(role.value);
    this.user.role = role.value.toLowerCase();
    console.log(this.user.role);
    this.firebaseService.updateUser('user', this.user.id, this.user).then(
      () => {
        this.isLoading = false;
        this.uiService.showSnackbar(this.user.firstName + ' ' + this.user.lastName + ' was updated', null, 2500);
        this.toggle('searchMode');
      },
      (err) => {
        this.uiService.showSnackbar(this.user.lastName + ' has error' + err, null, 2500);
      });
  }
  onDeleteUser(id) {
    this.isLoading = true;
    if (confirm('Are you sure to delete this User?')) {
      this.firebaseService.delUser('user', id).then(
        () => {
          this.isLoading = false;
          this.uiService.showSnackbar('User was deleted', null, 2500);
        });
      this.toggle('searchMode');
      this.getAllUsers();
    } else {
      this.isLoading = false;
    }
  }
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
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
