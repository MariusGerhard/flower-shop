import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { FirebaseService } from '../shared/services/firebase.service';
import { HeaderTitleService } from '../shared/services/header-title.service';

@Component({
  selector: 'app-terms-conditions',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './terms-conditions.html',
  styleUrl: './terms-conditions.scss',
})
export class TermsConditions {
  /** "Back to Register" only makes sense when nobody is logged in. */
  protected readonly isAuth = inject(FirebaseService).isAuth;

  constructor() {
    inject(HeaderTitleService).setTitle('Conditions');
  }
}
