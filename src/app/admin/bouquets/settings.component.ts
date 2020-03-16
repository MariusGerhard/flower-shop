import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {HeaderTitleService} from '../../shared/services/header-title.service';
import {FirebaseService} from '../../shared/services/firebase.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {fallIn, moveIn} from '../../router.animations';
import {Bouquet} from '../../shared/models/bouquet.model';
import {UIService} from '../../shared/services/ui.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations: [moveIn(), fallIn()],
})
export class SettingsComponent implements OnInit,  AfterViewInit, OnDestroy {
  // Animations
  state: string;
  toggleMode: string;
  // Datatable
  dataSource: MatTableDataSource<any>;
  myDocData: any;
  displayedColumns = ['name', 'category', '_id'];
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
  bouquets: Bouquet[];
  bouquet: Bouquet;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(db: AngularFirestore,
              private headerTitleService: HeaderTitleService,
              private uiService: UIService,
              private firebaseService: FirebaseService,
              private storage: AngularFireStorage) {
    this.toggleMode = 'searchMode';
  }
  ngOnInit() {
    this.headerTitleService.setTitle('Control');
    this.dataSource = new MatTableDataSource(this.bouquets);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  toggle(filter?) {
    if (!filter) {
      filter = 'searchMode';
    }
    this.toggleMode = filter;
  }
  getFilterData(filter: any) {
    this.isLoading = true;
    console.log(filter);
    if ( filter === '') {
      filter = 'a';
    }
    // console.log(filter);
    this.queryConnection = this.firebaseService.getFilterBouquets('bouquets', filter).subscribe(
      data => {
        this.bouquets = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as Bouquet;
        });
        this.dataSource = new MatTableDataSource(this.bouquets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
  getData() {
    this.isLoading = true;
    this.queryConnection = this.firebaseService.getBouquets('bouquets').subscribe(
      data => {
        this.bouquets = data.map(e => {
          return {
            _id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }as Bouquet;
        });
        this.dataSource = new MatTableDataSource(this.bouquets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
  setData(formData: Bouquet) {
    this.isLoading = true;
    this.firebaseService.setBouquets('bouquets', formData).then(
      () => {
       // this.firebaseService.updateBouquets('bouquets', formData._id, formData);
        this.isLoading = false;
        this.uiService.showSnackbar(formData.name + ' was added', null, 2500);
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      });
  }
  updateData(formData) {
    this.isLoading = true;
    this.firebaseService.updateBouquets('bouquets', formData._id, formData).then(
      () => {
      this.isLoading = false;
      this.toggle('searchMode');
      this.uiService.showSnackbar(formData.name + ' was updated', null, 2500);
    },
      (err) => {
      console.log(err);
    });
  }
  getDoc(id) {
    this.bouquet = this.bouquets.find(x => x._id === id);
    this.myDocData = this.bouquet;
    this.toggle('editMode');
  }
  deleteDoc(id) {
    this.isLoading = true;
    if (confirm('Are you sure to delete this bouquet?')) {
       this.firebaseService.delBouquet('bouquets', id).then(
         () => {
           this.isLoading = false;
           this.uiService.showSnackbar('Bouquet was deleted', null, 2500);
         });
       this.toggle('searchMode');
    } else {
      this.isLoading = false;
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
    this.dataSource.paginator.firstPage();
  }
  ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
  }
  ngOnDestroy() {
    if (this.queryConnection) {
      this.queryConnection.unsubscribe();
    }
  }
}
