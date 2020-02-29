/*
All Angular Material Components
 */
import {NgModule} from '@angular/core';

import {
  MatButtonModule, MatCardModule, MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatListModule,
  MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatSidenavModule, MatSortModule, MatTableModule,
  MatToolbarModule, MatTooltipModule
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
  MatCardModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatTooltipModule
];
@NgModule({
  imports: [MaterialModules],
  exports: [MaterialModules]
})

export class MaterialModule {}

