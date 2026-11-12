import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { HeaderTitleService } from '../../shared/services/header-title.service';
import { AdminBouquets } from '../bouquets/admin-bouquets';
import { AdminOrders } from '../orders/admin-orders';
import { AdminUsers } from '../users/admin-users';

@Component({
  selector: 'app-control',
  imports: [MatTabsModule, AdminBouquets, AdminOrders, AdminUsers],
  templateUrl: './control.html',
  styleUrl: './control.scss',
})
export class Control {
  constructor() {
    inject(HeaderTitleService).setTitle('Control');
  }
}
