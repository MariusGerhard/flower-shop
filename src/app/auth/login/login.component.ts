import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import {HeaderTitleService} from '../../services/header-title.service';
import {fallIn, moveIn} from '../../router.animations';

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
  constructor(private headerTitleService: HeaderTitleService) { }

  ngOnInit() {
    this.headerTitleService.setTitle('Login');
  }
  onSubmit(form: NgForm) {
    console.log(form);
  }
}
