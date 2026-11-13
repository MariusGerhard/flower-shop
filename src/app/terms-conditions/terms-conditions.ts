import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { FirebaseService } from '../shared/services/firebase.service';
import { HeaderTitleService } from '../shared/services/header-title.service';
import { I18nService } from '../i18n/i18n.service';

@Component({
  selector: 'app-terms-conditions',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './terms-conditions.html',
  styleUrl: './terms-conditions.scss',
})
export class TermsConditions {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  /** "Back to Register" only makes sense when nobody is logged in. */
  protected readonly isAuth = inject(FirebaseService).isAuth;

  constructor() {
    inject(HeaderTitleService).setTitle('titles.conditions');
  }
}
