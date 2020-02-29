import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {fallIn, moveIn} from '../../router.animations';
import {HeaderTitleService} from '../../services/header-title.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {FirebaseService} from '../../services/firebase.service';
import {AngularFireStorage} from '@angular/fire/storage';


@Component({
  selector: 'app-bouquets',
  templateUrl: './bouquets.component.html',
  styleUrls: ['./bouquets.component.css'],
  animations: [moveIn(), fallIn()],
  // tslint:disable-next-line:no-host-metadata-property
  host: {'@moveIn': ''},
})
export class BouquetsComponent implements OnInit, AfterViewInit, OnDestroy {
  // Animations
  state: string;
  toggleMode: string;
  // Datatable
  dataSource: MatTableDataSource<any>;
  myDocData: any;
  members: any[];
  displayedColumns = ['name', 'price', 'seasonStart', '_id'];
  // Our datatable variables
  savedChanges = false;
  error = false;
  errorMessage = '';
  isLoading =  false;
  // pictures
  profileUrl: Observable<string | null>;
  takeHostSelfie = false;
  showHostSelfie = false;
  myDocId;
  // database
  private queryConnection;
  bouquets: Observable<any[]>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(db: AngularFirestore,
              private headerTitleService: HeaderTitleService,
              private firebaseService: FirebaseService,
              private storage: AngularFireStorage) {
    /*
    this.bouquets = db.collection('bouquets').valueChanges();
    */
    this.toggleMode = 'searchMode';
  }
  ngOnInit() {
    this.headerTitleService.setTitle('Bouquets');
    this.dataSource = new MatTableDataSource(this.members);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  toggle(filter?) {
    if (!filter) {
      filter = 'searchMode';
    }
    this.toggleMode = filter;
  }
  getFilterData(filter: string) {
    this.isLoading = true;
    this.queryConnection = this.firebaseService.getFilterBouquets('bouquets', filter)
      .subscribe(members => {
          this.members = members;
          this.dataSource = new MatTableDataSource(members);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },
        (error) => {
          this.error = true;
          this.errorMessage = error.message;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
          this.error = false;
        });
  }
  getData() {
    this.isLoading = true;
    this.queryConnection = this.firebaseService.getBouquets('bouquets')
      .subscribe(members => {
        this.members = members;
        this.dataSource = new MatTableDataSource(members);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        },
        (error) => {
          this.error = true;
          this.errorMessage = error.message;
          this.isLoading = false;
        },
        () => {
        this.isLoading = false;
        this.error = false;
      });
  }
  setData(formData: string) {
    this.isLoading = true;
    this.queryConnection = this.firebaseService.setBouquets('bouquets', formData)
      .subscribe(members => {
        if (members) {
          this.savedChanges = true;
        }
        this.isLoading = false;
        },
        (error) => {
          this.error = true;
          this.errorMessage = error.message;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
          this.error = false;
        });
  }
  updateData(formData) {
    this.isLoading = true;
    this.queryConnection = this.firebaseService.updateBouquets('bouquets', formData)
      .subscribe(res => {
          if (res) {
            this.savedChanges = true;
          }
          this.isLoading = false;
        },
        (error) => {
          this.error = true;
          this.errorMessage = error.message;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
          this.error = false;
        });
  }
  getDoc(id) {
    this.isLoading = true;
    this.queryConnection = this.firebaseService.getBouquet('bouquets', id)
      .subscribe(res => {
          if (res) {
            this.myDocData = res;
            this.toggle('editMode');
            console.log('document');
            console.log(this.myDocData);
          }
          this.isLoading = false;
        },
        (error) => {
          this.error = true;
          this.errorMessage = error.message;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
          this.error = false;
        });
  }
  deleteDoc(id) {
    if (confirm('Are you sure to delete this bouquet?')) {
      this.isLoading = true;
      this.queryConnection = this.firebaseService.delBouquet('bouquets', id)
        .subscribe(res => {
            if (res) {
              this.toggle('searchMode');
            }
            this.isLoading = false;
          },
          (error) => {
            this.error = true;
            this.errorMessage = error.message;
            this.isLoading = false;
          },
          () => {
            this.isLoading = false;
            this.error = false;
          });
    }
  }
  // pictures
  getPic(picId) {
    const ref = this.storage.ref(picId);
    this.profileUrl = ref.getDownloadURL();
  }
  deleteProductPic(docId) {
    if (confirm('Are you sure want to delete this picture ?')) {
      this.firebaseService.delBouquetPic('bouquet', docId);
    }
  }
  // data table methods
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
    if (this.queryConnection) {
      this.queryConnection.unsubscribe();
    }
  }
}
