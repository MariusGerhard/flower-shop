import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AutofocusDirective } from './autofocus.directive';

@Component({
  imports: [AutofocusDirective],
  template: `<input id="other"><input id="target" appAutofocus>`,
})
class Host {}

describe('AutofocusDirective', () => {
  it('focuses the host element after rendering', async () => {
    const fixture = TestBed.createComponent(Host);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();

    expect(document.activeElement?.id).toBe('target');
    fixture.nativeElement.remove();
  });
});
