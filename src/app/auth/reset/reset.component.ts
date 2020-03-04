import { Component, OnInit } from '@angular/core';
import {fallIn, moveIn} from '../../router.animations';
import {NgForm} from '@angular/forms';
import {FirebaseService} from '../../shared/services/firebase.service';

@Component({
  selector: 'app-resset-pass',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
  animations: [moveIn(), fallIn()],
  // tslint:disable-next-line:no-host-metadata-property
  host: {'@moveIn': ''},
})
export class ResetComponent implements OnInit {
  state: string;
  isLoading = false;
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
  }
  onSubmit(form: NgForm) {
    this.isLoading = true;
    this.firebaseService.sendPasswordResetEmail(form.value.email.toString()).then(()  => {
      this.isLoading = false;
    }).catch(() => {
      this.isLoading = false;
    });
  }

}
