import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';

import { birthdateRange } from '../../shared/models/user.model';
import { FirebaseService } from '../../shared/services/firebase.service';
import { HeaderTitleService } from '../../shared/services/header-title.service';
import { I18nDatepickerIntl } from '../../i18n/i18n-datepicker-intl';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatRadioModule,
  ],
  templateUrl: './register.html',
  providers: [{ provide: MatDatepickerIntl, useClass: I18nDatepickerIntl }],
  styleUrl: './register.scss',
})
export class Register {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  private readonly firebase = inject(FirebaseService);

  protected readonly isLoading = signal(false);
  protected readonly range = birthdateRange();

  constructor() {
    inject(HeaderTitleService).setTitle('titles.register');
  }

  protected async onSubmit(form: NgForm): Promise<void> {
    const value = form.value;
    this.isLoading.set(true);
    try {
      await this.firebase.registerUser({
        email: value.email,
        password: value.password,
        gender: value.gender,
        firstName: value.firstName,
        lastName: value.lastName,
        birth: value.birthdate,
      });
    } catch {
      // Error is already shown by FirebaseService
    } finally {
      this.isLoading.set(false);
    }
  }
}
