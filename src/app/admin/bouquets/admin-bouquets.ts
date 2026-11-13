import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { catchError, of, switchMap, tap } from 'rxjs';

import { Bouquet, BouquetFilter, BouquetInput } from '../../shared/models/bouquet.model';
import { FirebaseService } from '../../shared/services/firebase.service';
import { UiService } from '../../shared/services/ui.service';
import { I18nPaginatorIntl } from '../../i18n/i18n-paginator-intl';
import { I18nService } from '../../i18n/i18n.service';

type Mode = 'search' | 'list' | 'add' | 'edit';

@Component({
  selector: 'app-admin-bouquets',
  imports: [
    CurrencyPipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './admin-bouquets.html',
  // Translated paginator labels (provided here, so the paginator is not part of the start bundle)
  providers: [{ provide: MatPaginatorIntl, useClass: I18nPaginatorIntl }],
  styleUrls: ['../admin.scss', './admin-bouquets.scss'],
})
export class AdminBouquets {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  private readonly firebase = inject(FirebaseService);
  private readonly ui = inject(UiService);

  protected readonly mode = signal<Mode>('search');
  protected readonly isLoading = signal(false);
  protected readonly editing = signal<Bouquet | null>(null);
  protected readonly pictureUrl = signal<string | null>(null);

  /** undefined = nothing loaded yet, null = all bouquets */
  private readonly filter = signal<BouquetFilter | null | undefined>(undefined);
  private readonly bouquets = toSignal(
    toObservable(this.filter).pipe(
      switchMap((filter) =>
        filter === undefined
          ? of([] as Bouquet[])
          : this.firebase.watchBouquets(filter).pipe(
              tap(() => this.isLoading.set(false)),
              catchError((err) => {
                this.isLoading.set(false);
                this.ui.showError(err, 'adminBouquets.loadFailed');
                return of([] as Bouquet[]);
              }),
            ),
      ),
    ),
    { initialValue: [] as Bouquet[] },
  );

  protected readonly displayedColumns = ['name', 'category', 'price', 'actions'];
  protected readonly dataSource = new MatTableDataSource<Bouquet>([]);
  private readonly paginator = viewChild(MatPaginator);
  private readonly sort = viewChild(MatSort);

  constructor() {
    effect(() => (this.dataSource.data = this.bouquets()));
    effect(() => {
      this.dataSource.paginator = this.paginator() ?? null;
      this.dataSource.sort = this.sort() ?? null;
    });
  }

  protected load(filter: BouquetFilter | null): void {
    this.isLoading.set(true);
    this.pictureUrl.set(null);
    this.filter.set(filter);
    this.mode.set('list');
  }

  protected onSearch(form: NgForm): void {
    const { name, category, flower } = form.value as BouquetFilter;
    this.load(name ? { name } : category ? { category } : flower ? { flower } : null);
  }

  protected startAdd(): void {
    this.editing.set(null);
    this.mode.set('add');
  }

  protected async onAdd(form: NgForm): Promise<void> {
    const data = this.toBouquetInput(form.value);
    this.isLoading.set(true);
    try {
      await this.firebase.addBouquet(data);
      this.ui.notify('adminBouquets.added', { name: data.name });
      form.resetForm();
    } catch (err) {
      this.ui.showError(err, 'adminBouquets.saveFailed');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected onEdit(bouquet: Bouquet): void {
    this.editing.set(bouquet);
    this.mode.set('edit');
  }

  protected async onUpdate(form: NgForm): Promise<void> {
    const bouquet = this.editing();
    if (!bouquet) {
      return;
    }
    const data = this.toBouquetInput(form.value);
    this.isLoading.set(true);
    try {
      await this.firebase.updateBouquet(bouquet.id, data);
      this.ui.notify('adminBouquets.updated', { name: data.name });
      this.mode.set('list');
    } catch (err) {
      this.ui.showError(err, 'adminBouquets.saveFailed');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async onDelete(bouquet: Bouquet): Promise<void> {
    if (!confirm(this.t('adminBouquets.confirmDelete', { name: bouquet.name }))) {
      return;
    }
    try {
      await this.firebase.deleteBouquet(bouquet.id);
      this.ui.notify('adminBouquets.deleted');
    } catch (err) {
      this.ui.showError(err, 'adminBouquets.deleteFailed');
    }
  }

  protected async showPicture(bouquet: Bouquet): Promise<void> {
    if (!bouquet.path) {
      return;
    }
    try {
      this.pictureUrl.set(await this.firebase.getPictureUrl(bouquet.path));
    } catch (err) {
      this.ui.showError(err, 'adminBouquets.pictureLoadFailed');
    }
  }

  protected async deletePicture(bouquet: Bouquet): Promise<void> {
    if (!confirm(this.t('adminBouquets.confirmDeletePicture'))) {
      return;
    }
    try {
      await this.firebase.deleteBouquetPicture(bouquet);
      this.pictureUrl.set(null);
      this.ui.notify('adminBouquets.pictureDeleted');
    } catch (err) {
      this.ui.showError(err, 'adminBouquets.pictureDeleteFailed');
    }
  }

  protected applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  private toBouquetInput(value: Record<string, string>): BouquetInput {
    return {
      name: value['name'],
      category: value['category'],
      description: value['description'] || null,
      flower: value['flower'],
      seasonStart: Number(value['seasonStart']),
      seasonEnd: Number(value['seasonEnd']),
      price: Number(value['price']),
    };
  }
}
