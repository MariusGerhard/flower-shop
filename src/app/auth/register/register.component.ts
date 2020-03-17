import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {HeaderTitleService} from '../../shared/services/header-title.service';
import {fallIn, moveIn} from '../../router.animations';
import {FirebaseService} from '../../shared/services/firebase.service';
import {UserModel} from '../../shared/models/userModel';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [moveIn(), fallIn()],
})
export class RegisterComponent implements OnInit {
  max: Date;
  min: Date;
  newUser: UserModel;
  state: string;
  error = false;
  userId: string;
  isLoading = false;
  saveId: string;
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
  private queryConnection;
  constructor(private headerTitleService: HeaderTitleService,
              private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.max = new Date();
    this.min = new Date();
    this.max.setFullYear(this.max.getFullYear() - 16);
    this.min.setFullYear(this.max.getFullYear() - 100);
    this.headerTitleService.setTitle('Register');
  }
  onSubmit(form: NgForm) {
    this.isLoading = true;
    this.firebaseService.registerUser({
      email: form.value.email,
      password: form.value.password,
      gender: form.value.gender,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      birth: form.value.birthdateValue,
    }).then(
      ()  => {
        this.isLoading = false;
        this.userId = this.firebaseService.getCurrentUserId();
        this.getUser();
      }).catch(() => {
      this.isLoading = false;
    });
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
        this.isLoading = false;
        this.firebaseService.updateUser('user', this.saveId, this.user).then(
          () => {
            this.isLoading = false;
          },
          (err) => {
            console.log(err);
            this.isLoading = false;
          });
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
}
