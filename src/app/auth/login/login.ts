import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FirebaseService } from '../../shared/services/firebase.service';
import { HeaderTitleService } from '../../shared/services/header-title.service';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  private readonly firebase = inject(FirebaseService);

  protected readonly isLoading = signal(false);

  constructor() {
    inject(HeaderTitleService).setTitle('titles.login');
  }

  protected async onSubmit(form: NgForm): Promise<void> {
    await this.run(() => this.firebase.loginUser({ email: form.value.email, password: form.value.password }));
  }

  protected async onLogin(provider: 'Google' | 'Facebook'): Promise<void> {
    await this.run(() => (provider === 'Google' ? this.firebase.loginGoogle() : this.firebase.loginFacebook()));
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this.isLoading.set(true);
    try {
      await action();
    } catch {
      // Error is already shown by FirebaseService
    } finally {
      this.isLoading.set(false);
    }
  }
}
