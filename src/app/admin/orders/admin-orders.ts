import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { catchError, of } from 'rxjs';

import { Order } from '../../shared/models/order.model';
import { FirebaseService } from '../../shared/services/firebase.service';
import { UiService } from '../../shared/services/ui.service';

/** Order history of all users. */
@Component({
  selector: 'app-admin-orders',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './admin-orders.html',
  styleUrl: '../admin.scss',
})
export class AdminOrders {
  private readonly ui = inject(UiService);

  /** undefined while loading */
  private readonly orders = toSignal(
    inject(FirebaseService)
      .watchOrders()
      .pipe(
        catchError((err) => {
          this.ui.showSnackbar(`Could not load orders: ${err.message ?? err}`, undefined, 3000);
          return of([] as Order[]);
        }),
      ),
  );
  protected readonly isLoading = computed(() => this.orders() === undefined);

  protected readonly displayedColumns = ['bouquetName', 'userName', 'pickUpDate', 'price'];
  protected readonly dataSource = new MatTableDataSource<Order>([]);
  private readonly paginator = viewChild(MatPaginator);
  private readonly sort = viewChild(MatSort);

  constructor() {
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
