/*
All Angular Material Components
 */
import {NgModule} from '@angular/core';

import {
  MatButtonModule, MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatSliderModule
} from '@angular/material';

const MaterialModules = [
  MatSliderModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
];
@NgModule({
  imports: [MaterialModules],
  exports: [MaterialModules]
})

export class MaterialModule {}

