import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FirebaseService} from '../../shared/services/firebase.service';
import {Subscription} from 'rxjs';
import {UIService} from '../../shared/services/ui.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Output() toggleNavEvent = new EventEmitter();
  userStatus = false;
  authSubscription: Subscription;
  constructor(private firebaseService: FirebaseService,
              private uiService: UIService) { }

  ngOnInit() {
    this.updateUserStatus();
  }
  onToggle() {
    this.toggleNavEvent.emit();
  }
  onLogout() {
    this.firebaseService.logoutUser().then(
      () => {
        this.uiService.showSnackbar('Logout successful', null, 1500);
        this.userStatus = false;
        this.onToggle();
      });
  }
  updateUserStatus() {
    this.authSubscription = this.firebaseService.authChanged.subscribe(authStatus => {
      this.userStatus = authStatus;
    });
  }
  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
