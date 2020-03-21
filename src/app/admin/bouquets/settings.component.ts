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
  ref;
  task;
  uploadProgress;
  path: string;
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
    if ( filter === '') {
      filter = 'a';
    }
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
      (res) => {
        formData._id = res.id;
        this.firebaseService.updateBouquets('bouquets', formData._id, formData);
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
  }
  deleteDoc(id) {
    this.isLoading = true;
    if (confirm('Are you sure to delete this bouquet?')) {
       this.firebaseService.delBouquet('bouquets', id).then(
         () => {
           this.isLoading = false;
           this.uiService.showSnackbar('Bouquet was deleted', null, 2500);
         });
    } else {
      this.isLoading = false;
    }
  }
  // pictures
 async upload(event) {
    this.path = Math.random().toString(36).substring(2);
    this.getDoc(this.myDocId);
    this.isLoading = true;
    this.bouquet.path = this.path;
    this.ref = this.storage.ref('bouquets/' + this.path);
    this.task = this.ref.put(event.target.files[0]).then(
      () => {
        this.firebaseService.updateBouquets('bouquets', this.myDocId, this.bouquet).then(
          () => {
            this.isLoading = false;
            this.takeHostSelfie = false;
            this.uiService.showSnackbar('Picture ready', null, 2000);
          });
      },
      () => {
        console.log('Upload stopped');
      }
    );
  }
  getPic(docId) {
    this.getDoc(docId);
    this.path = this.bouquet.path;
    this.ref = this.storage.ref('bouquets/' + this.path);
    this.profileUrl = this.ref.getDownloadURL();
  }
  deleteProductPic(docId) {
    if (confirm('Are you sure want to delete this picture ?')) {
      this.getDoc(docId);
      this.path = this.bouquet.path;
      this.ref = this.storage.ref('bouquets/' + this.path);
      this.task = this.ref.delete();
      this.firebaseService.delBouquetPic(docId).then(
        () => {
         this.uiService.showSnackbar('Picture deleted', null, 2000);
        });
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
