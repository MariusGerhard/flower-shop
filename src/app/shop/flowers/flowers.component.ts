import {Component, OnChanges, OnInit} from '@angular/core';
import {HeaderTitleService} from '../../services/header-title.service';
import {fallIn, moveIn} from '../../router.animations';

@Component({
  selector: 'app-flowers',
  templateUrl: './flowers.component.html',
  styleUrls: ['./flowers.component.css'],
  animations: [moveIn(), fallIn()],
  // tslint:disable-next-line:no-host-metadata-property
  host: {'@moveIn': ''},
})
export class FlowersComponent implements OnInit, OnChanges {
  state: string;
  constructor(private headerTitleService: HeaderTitleService) { }

  ngOnInit() {
    this.headerTitleService.setTitle('Custom');
    window.scroll(0, 0);
  }
  ngOnChanges() {
    window.scroll(0, 0);
  }

}
