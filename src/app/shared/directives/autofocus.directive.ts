import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/** Focuses the host element once it has been rendered. Usage: `<input appAutofocus>` */
@Directive({ selector: '[appAutofocus]' })
export class AutofocusDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => this.el.nativeElement.focus());
  }
}
