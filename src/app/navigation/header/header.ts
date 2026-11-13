import { Component, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { I18nService } from '../../i18n/i18n.service';
import { FirebaseService } from '../../shared/services/firebase.service';
import { HeaderTitleService } from '../../shared/services/header-title.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly firebase = inject(FirebaseService);
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  readonly toggleNav = output<void>();

  protected readonly title = inject(HeaderTitleService).title;
  protected readonly isAuth = this.firebase.isAuth;

  protected onLogout(): void {
    this.firebase.logoutUser();
  }
}
