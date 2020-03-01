/*
All Angular Material Components
 */
import {NgModule} from '@angular/core';

import {
  MatButtonModule, MatCardModule, MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule, MatIconModule, MatIconRegistry,
  MatInputModule, MatListModule,
  MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatSidenavModule, MatSnackBarModule, MatSortModule, MatTableModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

const MaterialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatTooltipModule,
  MatSnackBarModule
];
@NgModule({
  imports: [MaterialModules],
  exports: [MaterialModules]
})

export class MaterialModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      `flower`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/flower.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `bouquet`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/bouquet.svg')
    );
  }
}

