import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';

import { birthdateRange, toDate } from '../../shared/models/user.model';
import { FirebaseService } from '../../shared/services/firebase.service';
import { HeaderTitleService } from '../../shared/services/header-title.service';
import { UiService } from '../../shared/services/ui.service';
import { I18nDatepickerIntl } from '../../i18n/i18n-datepicker-intl';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-profile',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatRadioModule,
  ],
  templateUrl: './profile.html',
  providers: [{ provide: MatDatepickerIntl, useClass: I18nDatepickerIntl }],
  styleUrl: './profile.scss',
})
export class Profile {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  private readonly firebase = inject(FirebaseService);
  private readonly ui = inject(UiService);
  private readonly router = inject(Router);

  protected readonly user = this.firebase.profile;
  protected readonly birthday = computed(() => toDate(this.user()?.birth));
  protected readonly isEdit = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly range = birthdateRange();

  constructor() {
    inject(HeaderTitleService).setTitle('titles.profile');
  }

  protected toggleEdit(): void {
    this.isEdit.update((edit) => !edit);
  }

  protected async onSubmit(form: NgForm): Promise<void> {
    const user = this.user();
    if (!user) {
      return;
    }
    const { gender, firstName, lastName, birth } = form.value;
    this.isSaving.set(true);
    try {
      await this.firebase.updateUser(user.id, { gender, firstName, lastName, birth });
      this.ui.notify('profile.updated', { name: `${firstName} ${lastName}` });
      await this.router.navigate(['/shop']);
    } catch (err) {
      this.ui.showError(err, 'profile.saveFailed');
    } finally {
      this.isSaving.set(false);
    }
  }
}
