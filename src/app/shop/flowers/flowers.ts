import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { catchError, of } from 'rxjs';

import { FirebaseService } from '../../shared/services/firebase.service';
import { HeaderTitleService } from '../../shared/services/header-title.service';
import { UiService } from '../../shared/services/ui.service';

@Component({
  selector: 'app-flowers',
  imports: [CurrencyPipe, MatCardModule, MatProgressBarModule],
  templateUrl: './flowers.html',
  styleUrl: './flowers.scss',
})
export class Flowers {
  private readonly ui = inject(UiService);

  /** undefined while loading */
  protected readonly flowers = toSignal(
    inject(FirebaseService)
      .watchFlowers()
      .pipe(
        catchError((err) => {
          this.ui.showSnackbar(`Could not load flowers: ${err.message ?? err}`, undefined, 3000);
          return of([]);
        }),
      ),
  );
  protected readonly isLoading = computed(() => this.flowers() === undefined);

  constructor() {
    inject(HeaderTitleService).setTitle('Custom');
  }
}
