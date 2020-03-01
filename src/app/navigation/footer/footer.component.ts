import { Component, OnInit } from '@angular/core';
import {HeaderTitleService} from '../../shared/services/header-title.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isNotice = false;
  constructor(private headerTitleService: HeaderTitleService) {
    this.headerTitleService.title.subscribe(updatedTitle => {
     if (updatedTitle === 'Legal-Notice') {
       this.isNotice = true;
     } else {
       this.isNotice = false;
     }
    });
  }

  ngOnInit() {
  }

}
