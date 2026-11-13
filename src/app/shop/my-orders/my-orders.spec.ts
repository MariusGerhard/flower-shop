import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { FirebaseMock, createFirebaseMock, provideFirebaseMock, testUser } from '../../../testing/firebase-mock';
import { Order } from '../../shared/models/order.model';
import { MyOrders } from './my-orders';

const order: Order = {
  id: 'o1',
  userId: 'user-1',
  userName: 'Anna Blume',
  bouquetId: 'b1',
  bouquetName: 'Rose Dream',
  price: 25.5,
  orderDate: 'Thu Nov 12 2026',
  pickUpDate: 'Fri Nov 20 2026',
  event: 'Birthday',
  message: 'Alles Gute',
};

describe('MyOrders', () => {
  let firebase: FirebaseMock;

  beforeEach(() => {
    firebase = createFirebaseMock();
    firebase.watchUserOrders.mockReturnValue(of([order]));
    TestBed.configureTestingModule({
      imports: [MyOrders],
      providers: [provideRouter([]), ...provideFirebaseMock(firebase)],
    });
  });

  it('waits for the profile before loading orders', async () => {
    const fixture = TestBed.createComponent(MyOrders);
    await fixture.whenStable();

    expect(firebase.watchUserOrders).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).not.toBeNull();
  });

  it('loads the orders of the logged-in user into the table', async () => {
    firebase.profile.set(testUser());
    const fixture = TestBed.createComponent(MyOrders);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(firebase.watchUserOrders).toHaveBeenCalledWith('user-1');
    expect(el.querySelector('h3')!.textContent).toContain('Anna Blume Orders');
    expect(el.querySelector('td.mat-mdc-cell')!.textContent).toContain('Rose Dream');
  });

  it('shows the details of an order and goes back to the list', async () => {
    firebase.profile.set(testUser());
    const fixture = TestBed.createComponent(MyOrders);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    el.querySelector<HTMLButtonElement>('button[aria-label="Show details"]')!.click();
    await fixture.whenStable();

    expect(el.querySelector('mat-card-title')!.textContent).toBe('Rose Dream');
    expect(el.textContent).toContain('Birthday');
    expect(el.textContent).toContain('Alles Gute');

    Array.from(el.querySelectorAll<HTMLButtonElement>('button'))
      .find((b) => b.textContent?.trim() === 'back')!
      .click();
    await fixture.whenStable();

    expect(el.querySelector('table')).not.toBeNull();
  });

  it('shows a hint when there are no orders', async () => {
    firebase.watchUserOrders.mockReturnValue(of([]));
    firebase.profile.set(testUser());
    const fixture = TestBed.createComponent(MyOrders);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('No orders yet.');
  });
});
