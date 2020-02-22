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
    this.firebaseService.getUserStatus().subscribe(
      (res) => {
        this.userStatus = res;
      }
    );
  }
  onToggle() {
    this.toggleNavEvent.emit();
  }
}
