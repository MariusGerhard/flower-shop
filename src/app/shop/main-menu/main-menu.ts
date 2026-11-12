import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { HeaderTitleService } from '../../shared/services/header-title.service';

@Component({
  selector: 'app-main-menu',
  imports: [RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss',
})
export class MainMenu {
  constructor() {
    inject(HeaderTitleService).setTitle('Shop');
  }
}
