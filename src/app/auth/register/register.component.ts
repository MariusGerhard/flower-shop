import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {HeaderTitleService} from '../../services/header-title.service';
import {fallIn, moveIn} from '../../router.animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [moveIn(), fallIn()],
  // tslint:disable-next-line:no-host-metadata-property
  host: {'@moveIn': ''},
})
export class RegisterComponent implements OnInit {
  max: Date;
  min: Date;
  state: string;
  isLoading: false;
  constructor(private headerTitleService: HeaderTitleService) { }

  ngOnInit() {
    this.max = new Date();
    this.min = new Date();
    this.max.setFullYear(this.max.getFullYear() - 16);
    this.min.setFullYear(this.max.getFullYear() - 100);
    this.headerTitleService.setTitle('Register');
  }

  onSubmit(form: NgForm) {
    console.log(form);
  }
}
