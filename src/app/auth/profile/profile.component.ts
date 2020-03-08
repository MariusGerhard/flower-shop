import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HeaderTitleService} from '../../shared/services/header-title.service';
import {fallIn, moveIn} from '../../router.animations';
import {UserModel} from '../../shared/models/userModel';
import {FirebaseService} from '../../shared/services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [moveIn(), fallIn()],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('firstName', {static: false}) private firstName;
  @ViewChild('firstName', {static: false}) private lastName;
  user: UserModel[];
  userId: string;
  state: string;
  isLoading = false;
  isEdit = false;
  editTextString = 'Edit Settings';
  min: Date;
  max: Date;
  counter: number;
  private queryConnection;
  constructor(private headerTitleService: HeaderTitleService, private firebaseService: FirebaseService) {
    this.counter = 2;
  }

  ngOnInit() {
    this.headerTitleService.setTitle('Profile');
    this.userId = this.firebaseService.getCurrentUserId();
    this.queryConnection = this.firebaseService.getCurrentUser(this.userId).subscribe(
      res => {
        this.user = res.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as UserModel;
        });
        this.firstName.nativeElement = this.user[0].firstName;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        console.log(err);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  onEdit() {
    this.isEdit = !this.isEdit;
    if (this.editTextString === 'Edit Settings') {
      this.editTextString = 'Stop Edit';
    } else {
      this.editTextString = 'Edit Settings';
    }
  }
  onSubmit(formData) {
  }
  ngOnDestroy(): void {
    if (this.queryConnection) {
      this.queryConnection.unsubscribe();
    }
  }
}
