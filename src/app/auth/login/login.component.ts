import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import {HeaderTitleService} from '../../services/header-title.service';
import {fallIn, moveIn} from '../../router.animations';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [moveIn(), fallIn()],
  // tslint:disable-next-line:no-host-metadata-property
  host: {'@moveIn': ''},
})
export class LoginComponent implements OnInit {
  state: string;
  isLoading = false;
  error = false;
  errorMessage = 'Login incorrect';
  private queryConnection;
  constructor(private headerTitleService: HeaderTitleService, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.headerTitleService.setTitle('Login');
  }
  onSubmit(form: NgForm) {
      this.isLoading = true;
      this.queryConnection = this.firebaseService.loginUser(form)
        .subscribe(res => {
            console.log(res);
            this.isLoading = false;
          },
          (error) => {
            this.error = true;
            this.errorMessage = error.message;
            this.isLoading = false;
          },
          () => {
            this.isLoading = false;
            this.error = false;
          });
      console.log(form);
  }
}
