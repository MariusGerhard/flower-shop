import { Component, OnInit } from '@angular/core';
import {HeaderTitleService} from '../shared/services/header-title.service';
import {fallIn, moveIn} from '../router.animations';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.css'],
  animations: [moveIn(), fallIn()],
  // tslint:disable-next-line:no-host-metadata-property
  host: {'@moveIn': ''},
})
export class LegalNoticeComponent implements OnInit {
  state: string;
  constructor(private headerTitleService: HeaderTitleService) { }

  ngOnInit() {
    this.headerTitleService.setTitle('Legal-Notice');
  }

}
