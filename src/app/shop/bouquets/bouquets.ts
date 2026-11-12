import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { catchError, of, switchMap } from 'rxjs';

import { AutofocusDirective } from '../../shared/directives/autofocus.directive';
import { Bouquet, BouquetFilter } from '../../shared/models/bouquet.model';
import { FirebaseService } from '../../shared/services/firebase.service';
import { HeaderTitleService } from '../../shared/services/header-title.service';
import { UiService } from '../../shared/services/ui.service';

type Mode = 'search' | 'list' | 'detail' | 'order' | 'extras';

const EVENT_PRICE = 2.5;
const MESSAGE_PRICE = 3;

@Component({
  selector: 'app-bouquets',
  imports: [
    AutofocusDirective,
    CurrencyPipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
  ],
  templateUrl: './bouquets.html',
  styleUrl: './bouquets.scss',
})
export class Bouquets {
  private readonly firebase = inject(FirebaseService);
  private readonly ui = inject(UiService);
  private readonly router = inject(Router);

  protected readonly events = ['Birthday', 'Mothers Day', 'Christmas', 'Easter'];
  protected readonly mode = signal<Mode>('search');

  // ----- list -----
  /** null = all bouquets */
  private readonly filter = signal<BouquetFilter | null>(null);
  /** undefined while loading */
  private readonly bouquets = toSignal(
    toObservable(this.filter).pipe(
      switchMap((filter) =>
        this.firebase.watchBouquets(filter).pipe(
          catchError((err) => {
            this.ui.showSnackbar(`Could not load bouquets: ${err.message ?? err}`, undefined, 3000);
            return of([] as Bouquet[]);
          }),
        ),
      ),
    ),
  );
  protected readonly isLoading = computed(() => this.bouquets() === undefined);
  protected readonly listFilter = signal('');
  protected readonly visibleBouquets = computed(() => {
    const text = this.listFilter().trim().toLowerCase();
    const all = this.bouquets() ?? [];
    if (!text) {
      return all;
    }
    return all.filter((b) => [b.name, b.flower, b.category].some((v) => v?.toLowerCase().includes(text)));
  });

  // ----- order -----
  protected readonly selected = signal<Bouquet | null>(null);
  protected readonly event = signal('');
  protected readonly message = signal('');
  protected readonly pickUpDate = signal<Date | null>(null);
  protected readonly isOrdering = signal(false);
  protected readonly totalPrice = computed(() => {
    const base = Number(this.selected()?.price ?? 0);
    return base + (this.event() ? EVENT_PRICE : 0) + (this.message() ? MESSAGE_PRICE : 0);
  });
  protected readonly minDate = this.addDays(new Date(), 1);
  protected readonly maxDate = this.addDays(new Date(), 21);

  constructor() {
    inject(HeaderTitleService).setTitle('Bouquets');
  }

  protected onSearch(form: NgForm): void {
    const { name, category } = form.value as BouquetFilter;
    this.filter.set(name ? { name } : category ? { category } : null);
    this.mode.set('list');
  }

  protected showAll(): void {
    this.filter.set(null);
    this.mode.set('list');
  }

  protected onDetails(bouquet: Bouquet): void {
    this.selected.set(bouquet);
    this.event.set('');
    this.message.set('');
    this.pickUpDate.set(null);
    this.mode.set('detail');
  }

  protected back(): void {
    this.mode.set(this.mode() === 'list' ? 'search' : 'list');
  }

  protected async onOrder(): Promise<void> {
    const bouquet = this.selected();
    const user = this.firebase.profile();
    const pickUpDate = this.pickUpDate();
    if (!bouquet || !user || !pickUpDate) {
      this.ui.showSnackbar('Please login and choose a pick-up day', undefined, 2500);
      return;
    }
    this.isOrdering.set(true);
    try {
      await this.firebase.placeOrder({
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        bouquetId: bouquet.id,
        bouquetName: bouquet.name,
        price: this.totalPrice(),
        orderDate: new Date().toDateString(),
        pickUpDate: pickUpDate.toDateString(),
        event: this.event(),
        message: this.message(),
      });
      this.ui.showSnackbar(`Your order of ${bouquet.name} was successful`, undefined, 2500);
      await this.router.navigate(['/shop']);
    } catch (err) {
      console.error(err);
      this.ui.showSnackbar(`Order failed: ${err}`, undefined, 3000);
    } finally {
      this.isOrdering.set(false);
    }
  }

  private addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
}
