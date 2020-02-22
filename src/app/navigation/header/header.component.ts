import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HeaderTitleService} from '../../services/header-title.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  selectedIndex = -1;
  @Output() toggleEvent = new EventEmitter();
  title = '';
  constructor(private headerTitleService: HeaderTitleService) {
    this.headerTitleService.title.subscribe(updatedTitle => {
      this.title = updatedTitle;
    });
  }

  ngOnInit() {
  }
  onToggle() {
    this.toggleEvent.emit();
  }
  setSelected(id: number) {
    this.selectedIndex = id;
  }

}
