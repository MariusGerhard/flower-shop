import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { HeaderTitleService } from '../shared/services/header-title.service';
import { I18nService } from '../i18n/i18n.service';

@Component({
  selector: 'app-legal-notice',
  imports: [RouterLink, MatCardModule],
  templateUrl: './legal-notice.html',
  styleUrl: './legal-notice.scss',
})
export class LegalNotice {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  constructor() {
    inject(HeaderTitleService).setTitle('titles.legalNotice');
  }
}
