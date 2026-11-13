import { Component, effect, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { I18nService } from './i18n/i18n.service';
import { Footer } from './navigation/footer/footer';
import { Header } from './navigation/header/header';
import { Sidenav } from './navigation/sidenav/sidenav';
import { FirebaseService } from './shared/services/firebase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, Header, Sidenav, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    // Starts the auth listener as soon as the app boots
    inject(FirebaseService);

    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIcon('flower', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/flower.svg'));
    iconRegistry.addSvgIcon('bouquet', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/bouquet.svg'));

    // Datepickers show month names and date format of the selected language
    const i18n = inject(I18nService);
    const dateAdapter = inject(DateAdapter);
    effect(() => dateAdapter.setLocale(i18n.locale()));
  }
}
