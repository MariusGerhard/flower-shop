import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HeaderTitleService } from '../../shared/services/header-title.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, MatToolbarModule, MatIconModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly title = inject(HeaderTitleService).title;

  protected readonly isNotice = computed(() => this.title() === 'Legal-Notice');
}
