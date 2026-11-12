import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';

import { birthdateRange, toDate } from '../../shared/models/user.model';
import { FirebaseService } from '../../shared/services/firebase.service';
import { HeaderTitleService } from '../../shared/services/header-title.service';
import { UiService } from '../../shared/services/ui.service';

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
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly firebase = inject(FirebaseService);
  private readonly ui = inject(UiService);
  private readonly router = inject(Router);

  protected readonly user = this.firebase.profile;
  protected readonly birthday = computed(() => toDate(this.user()?.birth));
  protected readonly isEdit = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly range = birthdateRange();

  constructor() {
    inject(HeaderTitleService).setTitle('Profile');
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
      this.ui.showSnackbar(`${firstName} ${lastName} was updated`, undefined, 2500);
      await this.router.navigate(['/shop']);
    } catch (err) {
      this.ui.showSnackbar(`${lastName} has error ${err}`, undefined, 2500);
    } finally {
      this.isSaving.set(false);
    }
  }
}
