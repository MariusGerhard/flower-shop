import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { HeaderTitleService } from '../shared/services/header-title.service';

@Component({
  selector: 'app-legal-notice',
  imports: [RouterLink, MatCardModule],
  templateUrl: './legal-notice.html',
  styleUrl: './legal-notice.scss',
})
export class LegalNotice {
  constructor() {
    inject(HeaderTitleService).setTitle('Legal-Notice');
  }
}
