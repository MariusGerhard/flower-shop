/*
Our own directive which sets autofocus on html elements used in the result and login component
called with appAutoFocus
*/
import {AfterViewInit, Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements OnInit, AfterViewInit {
  private autoFocus;
  constructor( private el: ElementRef ) { }
  // Checks if there is an autofocus
  ngOnInit() {
    if (this.autoFocus || typeof this.autoFocus === 'undefined') {
      this.el.nativeElement.focus();
    }
  }
  // Sets our window on a new focus
  ngAfterViewInit() {
    window.setTimeout(() => {
      this.el.nativeElement.focus();
    });
  }
  // Switch for autofocus
  @Input() set autofocus(condition: boolean) {
    this.autoFocus = condition !== false;
  }
}
