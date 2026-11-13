import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { HeaderTitleService } from '../../shared/services/header-title.service';
import { AdminBouquets } from '../bouquets/admin-bouquets';
import { AdminOrders } from '../orders/admin-orders';
import { AdminUsers } from '../users/admin-users';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-control',
  imports: [MatTabsModule, AdminBouquets, AdminOrders, AdminUsers],
  templateUrl: './control.html',
  styleUrl: './control.scss',
})
export class Control {
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  constructor() {
    inject(HeaderTitleService).setTitle('titles.control');
  }
}
