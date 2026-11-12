import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { catchError, of, switchMap } from 'rxjs';

import { AutofocusDirective } from '../../shared/directives/autofocus.directive';
import { Order } from '../../shared/models/order.model';
import { FirebaseService } from '../../shared/services/firebase.service';
import { HeaderTitleService } from '../../shared/services/header-title.service';
import { UiService } from '../../shared/services/ui.service';

@Component({
  selector: 'app-my-orders',
  imports: [
    AutofocusDirective,
    CurrencyPipe,
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss',
})
export class MyOrders {
  private readonly firebase = inject(FirebaseService);
  private readonly ui = inject(UiService);

  protected readonly user = this.firebase.profile;
  /** undefined while loading */
  private readonly orders = toSignal(
    toObservable(this.user).pipe(
      switchMap((user) =>
        user
          ? this.firebase.watchUserOrders(user.id).pipe(
              catchError((err) => {
                this.ui.showSnackbar(`Could not load orders: ${err.message ?? err}`, undefined, 3000);
                return of([] as Order[]);
              }),
            )
          : of(undefined),
      ),
    ),
  );
  protected readonly isLoading = computed(() => this.orders() === undefined);
  protected readonly selected = signal<Order | null>(null);

  protected readonly displayedColumns = ['bouquetName', 'orderDate', 'action'];
  protected readonly dataSource = new MatTableDataSource<Order>([]);
  private readonly paginator = viewChild(MatPaginator);
  private readonly sort = viewChild(MatSort);

  constructor() {
    inject(HeaderTitleService).setTitle('My Orders');
    effect(() => (this.dataSource.data = this.orders() ?? []));
    effect(() => {
      this.dataSource.paginator = this.paginator() ?? null;
      this.dataSource.sort = this.sort() ?? null;
    });
  }

  protected applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }
}
