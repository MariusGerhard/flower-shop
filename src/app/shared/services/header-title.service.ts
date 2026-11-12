import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HeaderTitleService {
  private readonly _title = signal('Home');
  readonly title = this._title.asReadonly();

  setTitle(title: string): void {
    this._title.set(title);
  }
}
