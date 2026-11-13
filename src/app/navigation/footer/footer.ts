import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HeaderTitleService } from '../../shared/services/header-title.service';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, MatToolbarModule, MatIconModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  private readonly title = inject(HeaderTitleService).title;

  protected readonly isNotice = computed(() => this.title() === 'titles.legalNotice');
}
