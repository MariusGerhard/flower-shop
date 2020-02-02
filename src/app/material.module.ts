/*
All Angular Material Components
 */
import {NgModule} from '@angular/core';

import {
  MatButtonModule, MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatListModule,
  MatNativeDateModule, MatSidenavModule,
  MatToolbarModule
} from '@angular/material';

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
];
@NgModule({
  imports: [MaterialModules],
  exports: [MaterialModules]
})

export class MaterialModule {}

