import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HeaderTitleService} from '../../services/header-title.service';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleEvent = new EventEmitter();
  userStatus = false;
  selectedIndex = -1;
  title = '';
  constructor(private headerTitleService: HeaderTitleService, private firebaseService: FirebaseService) {
    this.headerTitleService.title.subscribe(updatedTitle => {
      this.title = updatedTitle;
    });
  }
  ngOnInit() {
    this.firebaseService.getUserStatus().subscribe(
      (res) => {
        this.userStatus = res;
        console.log('Header userstatus:' + this.userStatus);
      }
    );
  }
  onToggle() {
    this.toggleEvent.emit();
  }
  setSelected(id: number) {
    this.selectedIndex = id;
  }
  onLogout() {
    this.firebaseService.logoutUser();
    this.userStatus = false;
  }

}
