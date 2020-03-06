import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {HeaderTitleService} from '../../shared/services/header-title.service';
import {FirebaseService} from '../../shared/services/firebase.service';
import {Subscription} from 'rxjs';
import {UIService} from '../../shared/services/ui.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleEvent = new EventEmitter();
  userStatus = false;
  selectedIndex = -1;
  title = '';
  authSubscription: Subscription;
  constructor(private headerTitleService: HeaderTitleService,
              private firebaseService: FirebaseService,
              private uiService: UIService) {
    this.headerTitleService.title.subscribe(updatedTitle => {
      this.title = updatedTitle;
    });
  }
  ngOnInit() {
    this.authSubscription = this.firebaseService.authChanged.subscribe(authStatus => {
      this.userStatus = authStatus;
    });
  }
  onToggle() {
    this.toggleEvent.emit();
  }
  setSelected(id: number) {
    this.selectedIndex = id;
  }
  onLogout() {
    this.firebaseService.logoutUser().then(r => console.log('Logged out' + r));
    this.uiService.showSnackbar('Logout successful', null, 1500);
    this.userStatus = false;
  }
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
