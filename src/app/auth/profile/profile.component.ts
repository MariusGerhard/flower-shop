import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderTitleService} from '../../shared/services/header-title.service';
import {fallIn, moveIn} from '../../router.animations';
import {UserModel} from '../../shared/models/userModel';
import {FirebaseService} from '../../shared/services/firebase.service';
import {UIService} from '../../shared/services/ui.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [moveIn(), fallIn()],
})
export class ProfileComponent implements OnInit, OnDestroy {
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
  saveId: string;
  userId: string;
  state: string;
  birthdayValue: string;
  isLoading = false;
  isEdit = false;
  birthday: Date;
  editTextString = 'Edit Settings';
  min: Date;
  max: Date;
  birthObject: any;
  counter: number;
  private queryConnection;
  constructor(private headerTitleService: HeaderTitleService,
              private firebaseService: FirebaseService,
              private router: Router,
              private uiService: UIService) {
  }
  ngOnInit() {
    this.headerTitleService.setTitle('Profile');
    this.max = new Date();
    this.min = new Date();
    this.max.setFullYear(this.max.getFullYear() - 16);
    this.min.setFullYear(this.max.getFullYear() - 100);
    this.isLoading = true;
    this.userId = this.firebaseService.getCurrentUserId();
    this.getUser();
  }
  getUser() {
    this.queryConnection = this.firebaseService.getCurrentUser(this.userId).subscribe(
      res => {
        this.users = res.map(e => {
          this.saveId = e.payload.doc.id;
          return {
            authId: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as UserModel;
        });
        this.users[0].id = this.saveId;
        this.user = this.users[0];
        this.birthObject = this.user.birth;
        if (this.birthObject === undefined) {
          this.birthday = new Date(124456666);
        } else {
          this.birthday = new Date(this.birthObject.seconds * 1000);
        }
        this.birthdayValue = this.birthday.toDateString();
        if (isNaN( this.user.countOrders)) {
          this.counter = 0;
        } else {
          this.counter = this.user.countOrders;
        }
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
  onEdit() {
    this.isEdit = !this.isEdit;
    if (this.editTextString === 'Edit Settings') {
      this.editTextString = 'Stop Edit';
    } else {
      this.editTextString = 'Edit Settings';
    }
  }
  onSubmit(formData) {
    this.firebaseService.updateUser('user', formData.value.id, formData.value).then(
      () => {
        this.isLoading = false;
        this.uiService.showSnackbar(formData.value.firstName + ' ' + formData.value.lastName + ' was updated', null, 2500);
        this.router.navigate(['/shop']);
      },
      (err) => {
        this.uiService.showSnackbar(formData.value.lastName + ' has error' + err, null, 2500);
      });
  }
  ngOnDestroy(): void {
    if (this.queryConnection) {
      this.queryConnection.unsubscribe();
    }
  }
}
