import {Component, OnChanges, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ViewportScroller} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {
  constructor(private router: Router, private viewportScroller: ViewportScroller) { }
  ngOnInit() {
    const element = document.querySelector('div') || window;
    element.scrollTo(0, 0);
  }
  ngOnChanges() {
    const element = document.querySelector('div') || window;
    element.scrollTo(0, 0);
  }
}
