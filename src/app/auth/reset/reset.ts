import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FirebaseService } from '../../shared/services/firebase.service';
import { HeaderTitleService } from '../../shared/services/header-title.service';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-reset',
  imports: [FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatProgressBarModule],
  templateUrl: './reset.html',
  styleUrl: './reset.scss',
})
export class Reset {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  private readonly firebase = inject(FirebaseService);

  protected readonly isLoading = signal(false);

  constructor() {
    inject(HeaderTitleService).setTitle('titles.reset');
  }

  protected async onSubmit(form: NgForm): Promise<void> {
    this.isLoading.set(true);
    try {
      await this.firebase.sendPasswordResetEmail(String(form.value.email));
    } catch {
      // Error is already shown by FirebaseService
    } finally {
      this.isLoading.set(false);
    }
  }
}
