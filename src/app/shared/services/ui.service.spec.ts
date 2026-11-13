import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UiService } from './ui.service';

describe('UiService', () => {
  it('opens a snackbar with the app panel class', () => {
    const snackbar = { open: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: MatSnackBar, useValue: snackbar }] });

    TestBed.inject(UiService).showSnackbar('Saved', 'OK', 1500);

    expect(snackbar.open).toHaveBeenCalledWith('Saved', 'OK', { duration: 1500, panelClass: ['snackbar'] });
  });

  it('shows a friendly text for errors and logs the original', () => {
    const snackbar = { open: vi.fn() };
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    TestBed.configureTestingModule({ providers: [{ provide: MatSnackBar, useValue: snackbar }] });
    const error = { code: 'permission-denied', message: 'Missing or insufficient permissions.' };

    TestBed.inject(UiService).showError(error, 'adminBouquets.deleteFailed');

    expect(snackbar.open).toHaveBeenCalledWith(
      "Could not delete the bouquet. You don't have permission to do this.",
      undefined,
      { duration: 4000, panelClass: ['snackbar'] },
    );
    expect(log).toHaveBeenCalledWith(error);
  });

  it('uses 2 seconds as default duration', () => {
    const snackbar = { open: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: MatSnackBar, useValue: snackbar }] });

    TestBed.inject(UiService).showSnackbar('Hi');

    expect(snackbar.open).toHaveBeenCalledWith('Hi', undefined, { duration: 2000, panelClass: ['snackbar'] });
  });
});
