import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UIService {
  constructor(private snackbar: MatSnackBar) {
  }
  showSnackbar(message, action, durationInput) {
    this.snackbar.open(message, action, {
      duration: durationInput,
      panelClass: ['snackbar']
    });
  }
}
