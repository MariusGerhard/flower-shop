import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { catchError, of, switchMap, tap } from 'rxjs';

import { UserModel } from '../../shared/models/user.model';
import { FirebaseService } from '../../shared/services/firebase.service';
import { UiService } from '../../shared/services/ui.service';
import { I18nPaginatorIntl } from '../../i18n/i18n-paginator-intl';
import { I18nService } from '../../i18n/i18n.service';
import { TranslationKey } from '../../i18n/i18n.types';

type Mode = 'search' | 'list' | 'edit';

interface UserCriteria {
  role?: string;
  minOrders?: number;
}

@Component({
  selector: 'app-admin-users',
  imports: [
    DecimalPipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './admin-users.html',
  // Translated paginator labels (provided here, so the paginator is not part of the start bundle)
  providers: [{ provide: MatPaginatorIntl, useClass: I18nPaginatorIntl }],
  styleUrl: '../admin.scss',
})
export class AdminUsers {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  private readonly firebase = inject(FirebaseService);
  private readonly ui = inject(UiService);

  protected readonly roles = ['User', 'Employee', 'Admin'];
  protected readonly updateRoles = ['User', 'Employee'];
  /** Translated label for a role value like 'User' or 'admin' */
  protected roleLabel(role: string | undefined): string {
    const key = `adminUsers.roles.${(role ?? '').toLowerCase()}` as TranslationKey;
    const text = this.t(key);
    return text === key ? (role ?? '') : text;
  }

  protected readonly mode = signal<Mode>('search');
  protected readonly isLoading = signal(false);
  protected readonly selected = signal<UserModel | null>(null);
  protected readonly newRole = signal<string | null>(null);

  private readonly loadRequested = signal(false);
  private readonly criteria = signal<UserCriteria | null>(null);
  private readonly users = toSignal(
    toObservable(this.loadRequested).pipe(
      switchMap((load) =>
        load
          ? this.firebase.watchUsers().pipe(
              tap(() => this.isLoading.set(false)),
              catchError((err) => {
                this.isLoading.set(false);
                this.ui.showError(err, 'adminUsers.loadFailed');
                return of([] as UserModel[]);
              }),
            )
          : of([] as UserModel[]),
      ),
    ),
    { initialValue: [] as UserModel[] },
  );
  private readonly rows = computed(() => {
    const criteria = this.criteria();
    const users = this.users();
    if (criteria?.role) {
      const role = criteria.role.toLowerCase();
      return users.filter((u) => u.role?.toLowerCase() === role);
    }
    if (criteria?.minOrders !== undefined) {
      const min = criteria.minOrders;
      return users.filter((u) => (u.countOrders ?? 0) >= min);
    }
    return users;
  });

  protected readonly displayedColumns = ['lastName', 'role', 'countOrders', 'actions'];
  protected readonly dataSource = new MatTableDataSource<UserModel>([]);
  private readonly paginator = viewChild(MatPaginator);
  private readonly sort = viewChild(MatSort);

  constructor() {
    effect(() => (this.dataSource.data = this.rows()));
    effect(() => {
      this.dataSource.paginator = this.paginator() ?? null;
      this.dataSource.sort = this.sort() ?? null;
    });
  }

  protected showAll(): void {
    this.show(null);
  }

  protected onSearch(form: NgForm): void {
    const { role, counter } = form.value as { role?: string; counter?: string };
    this.show(role ? { role } : { minOrders: Number(counter ?? 0) });
  }

  protected onEdit(user: UserModel): void {
    this.selected.set(user);
    this.newRole.set(null);
    this.mode.set('edit');
  }

  protected async onChangeRole(): Promise<void> {
    const user = this.selected();
    const role = this.newRole();
    if (!user || !role) {
      return;
    }
    try {
      await this.firebase.updateUser(user.id, { role: role.toLowerCase() });
      this.ui.notify('adminUsers.updated', { name: `${user.firstName} ${user.lastName}` });
      this.mode.set('list');
    } catch (err) {
      this.ui.showError(err, 'adminUsers.updateFailed', { name: `${user.firstName} ${user.lastName}` });
    }
  }

  protected async onDelete(user: UserModel): Promise<void> {
    if (!confirm(this.t('adminUsers.confirmDelete', { name: `${user.firstName} ${user.lastName}` }))) {
      return;
    }
    try {
      await this.firebase.deleteUser(user.id);
      this.ui.notify('adminUsers.deleted');
    } catch (err) {
      this.ui.showError(err, 'adminUsers.deleteFailed', { name: `${user.firstName} ${user.lastName}` });
    }
  }

  protected applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  private show(criteria: UserCriteria | null): void {
    if (!this.loadRequested()) {
      this.isLoading.set(true);
      this.loadRequested.set(true);
    }
    this.criteria.set(criteria);
    this.mode.set('list');
  }
}
