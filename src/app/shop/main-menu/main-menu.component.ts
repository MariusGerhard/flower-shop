import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HeaderTitleService} from '../../shared/services/header-title.service';
import {fallIn, moveIn} from '../../router.animations';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
  animations: [moveIn(), fallIn()],
})
export class MainMenuComponent implements OnInit {
  @Output() toggleHeader = new EventEmitter();
  state: string;
  constructor(private headerTitleService: HeaderTitleService) { }

  ngOnInit() {
    this.headerTitleService.setTitle('Shop');
  }
  onToggleHeader() {
    this.toggleHeader.emit();
  }
}
