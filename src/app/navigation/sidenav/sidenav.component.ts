import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @Output() toggleNavEvent = new EventEmitter();
  userStatus = false;
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.updateUserStatus();
  }
  onToggle() {
    this.toggleNavEvent.emit();
  }
  onLogout() {
    this.firebaseService.logoutUser();
    this.userStatus = false;
    this.onToggle();
  }
  updateUserStatus() {
    this.firebaseService.getUserStatus().subscribe(
      (res) => {
        this.userStatus = res;
      }
    );
  }
}
