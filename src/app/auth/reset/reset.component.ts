import { Component, OnInit } from '@angular/core';
import {fallIn, moveIn} from '../../router.animations';
import {NgForm} from '@angular/forms';
import {FirebaseService} from '../../shared/services/firebase.service';
import {UIService} from '../../shared/services/ui.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
  animations: [moveIn(), fallIn()],
})
export class ResetComponent implements OnInit {
  state: string;
  isLoading = false;
  constructor(private firebaseService: FirebaseService,
              private uiService: UIService) { }

  ngOnInit() {
  }
  onSubmit(form: NgForm) {
    this.isLoading = true;
    this.firebaseService.sendPasswordResetEmail(form.value.email.toString()).then(()  => {
      this.isLoading = false;
      this.uiService.showSnackbar('E-Mail was send', null, 2000);
    }).catch(() => {
      this.isLoading = false;
    });
  }

}
