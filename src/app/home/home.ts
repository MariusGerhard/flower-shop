import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { HeaderTitleService } from '../shared/services/header-title.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatCardModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor() {
    inject(HeaderTitleService).setTitle('Home');
  }
}
