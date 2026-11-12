import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class UiService {
  private readonly snackbar = inject(MatSnackBar);

  showSnackbar(message: string, action?: string, duration = 2000): void {
    this.snackbar.open(message, action, {
      duration,
      panelClass: ['snackbar'],
    });
  }
}
