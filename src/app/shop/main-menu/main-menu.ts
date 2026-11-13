import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { HeaderTitleService } from '../../shared/services/header-title.service';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-main-menu',
  imports: [RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss',
})
export class MainMenu {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  constructor() {
    inject(HeaderTitleService).setTitle('titles.shop');
  }
}
