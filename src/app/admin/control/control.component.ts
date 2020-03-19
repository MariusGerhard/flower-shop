import {Component, OnInit} from '@angular/core';
import {HeaderTitleService} from '../../shared/services/header-title.service';
import {fallIn, moveIn} from '../../router.animations';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css'],
  animations: [moveIn(), fallIn()],
})
export class ControlComponent implements OnInit {
  state = '';
  error = false;
  constructor(private headerTitleService: HeaderTitleService) { }

  ngOnInit() {
    this.headerTitleService.setTitle('Control');
  }
}
