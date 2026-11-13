import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { FirebaseService } from '../../shared/services/firebase.service';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, MatListModule, MatIconModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  private readonly firebase = inject(FirebaseService);

  readonly closeNav = output<void>();

  protected readonly isAuth = this.firebase.isAuth;

  protected async onLogout(): Promise<void> {
    await this.firebase.logoutUser();
    this.closeNav.emit();
  }
}
