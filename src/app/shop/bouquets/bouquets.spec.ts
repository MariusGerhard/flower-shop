import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { of } from 'rxjs';

import {
  FirebaseMock,
  UiMock,
  createFirebaseMock,
  createUiMock,
  provideFirebaseMock,
  testUser,
} from '../../../testing/firebase-mock';
import { Bouquet } from '../../shared/models/bouquet.model';
import { Bouquets } from './bouquets';

const rose: Bouquet = {
  id: 'b1',
  name: 'Rose Dream',
  category: 'Mum',
  description: 'Red roses',
  flower: 'Rose',
  seasonStart: 1,
  seasonEnd: 12,
  price: 20,
};
const tulip: Bouquet = { ...rose, id: 'b2', name: 'Tulip Joy', category: 'Friend', flower: 'Tulip', price: 15 };

describe('Bouquets', () => {
  let firebase: FirebaseMock;
  let ui: UiMock;
  let fixture: ComponentFixture<Bouquets>;
  let component: Bouquets;

  beforeEach(() => {
    firebase = createFirebaseMock();
    firebase.watchBouquets.mockReturnValue(of([rose, tulip]));
    ui = createUiMock();
    TestBed.configureTestingModule({
      imports: [Bouquets],
      providers: [provideRouter([]), provideNativeDateAdapter(), ...provideFirebaseMock(firebase, ui)],
    });
    fixture = TestBed.createComponent(Bouquets);
    component = fixture.componentInstance;
  });

  it('starts in search mode', async () => {
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('All Bouquets');
  });

  it('lists all bouquets after "show all"', async () => {
    component['showAll']();
    await fixture.whenStable();

    const titles = Array.from(fixture.nativeElement.querySelectorAll('mat-card-title')).map((t) =>
      (t as HTMLElement).textContent?.trim(),
    );
    expect(titles).toEqual(['Rose Dream', 'Tulip Joy']);
    expect(firebase.watchBouquets).toHaveBeenLastCalledWith(null);
  });

  it('searches by name first, then by category', async () => {
    component['onSearch']({ value: { name: 'Rose' } } as NgForm);
    await fixture.whenStable();
    expect(firebase.watchBouquets).toHaveBeenLastCalledWith({ name: 'Rose' });

    component['onSearch']({ value: { category: 'Mum' } } as NgForm);
    await fixture.whenStable();
    expect(firebase.watchBouquets).toHaveBeenLastCalledWith({ category: 'Mum' });
    expect(component['mode']()).toBe('list');
  });

  it('filters the list by name, flower or category', () => {
    TestBed.tick(); // toObservable() emits after the first change detection
    component['listFilter'].set('tulip');
    expect(component['visibleBouquets']().map((b) => b.id)).toEqual(['b2']);

    component['listFilter'].set('MUM');
    expect(component['visibleBouquets']().map((b) => b.id)).toEqual(['b1']);

    component['listFilter'].set('  ');
    expect(component['visibleBouquets']()).toHaveLength(2);
  });

  describe('price', () => {
    beforeEach(() => component['onDetails'](rose));

    it('is the bouquet price without extras', () => {
      expect(component['totalPrice']()).toBe(20);
    });

    it('adds 2.50 for an event and 3.00 for a greetings card', () => {
      component['event'].set('Birthday');
      expect(component['totalPrice']()).toBe(22.5);

      component['message'].set('Happy birthday!');
      expect(component['totalPrice']()).toBe(25.5);

      component['event'].set('');
      expect(component['totalPrice']()).toBe(23);
    });

    it('resets the extras when another bouquet is selected', () => {
      component['event'].set('Easter');
      component['message'].set('Hi');

      component['onDetails'](tulip);

      expect(component['totalPrice']()).toBe(15);
      expect(component['mode']()).toBe('detail');
    });
  });

  describe('ordering', () => {
    it('places the order with extras and goes back to the shop', async () => {
      firebase.profile.set(testUser());
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const pickUp = new Date(2026, 10, 20);
      component['onDetails'](rose);
      component['event'].set('Birthday');
      component['message'].set('Alles Gute');
      component['pickUpDate'].set(pickUp);

      await component['onOrder']();

      expect(firebase.placeOrder).toHaveBeenCalledWith({
        userId: 'user-1',
        userName: 'Anna Blume',
        bouquetId: 'b1',
        bouquetName: 'Rose Dream',
        price: 25.5,
        orderDate: expect.any(String),
        pickUpDate: pickUp.toDateString(),
        event: 'Birthday',
        message: 'Alles Gute',
      });
      expect(ui.notify).toHaveBeenCalledWith('bouquets.orderSuccess', { name: 'Rose Dream' });
      expect(navigate).toHaveBeenCalledWith(['/shop']);
      expect(component['isOrdering']()).toBe(false);
    });

    it('does not order without a pick-up day', async () => {
      firebase.profile.set(testUser());
      component['onDetails'](rose);

      await component['onOrder']();

      expect(firebase.placeOrder).not.toHaveBeenCalled();
      expect(ui.notify).toHaveBeenCalledWith('bouquets.needPickUp');
    });

    it('shows an error and stays on the page when the order fails', async () => {
      firebase.profile.set(testUser());
      const error = { code: 'unavailable' };
      firebase.placeOrder.mockRejectedValue(error);
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
      component['onDetails'](rose);
      component['pickUpDate'].set(new Date());

      await component['onOrder']();

      expect(navigate).not.toHaveBeenCalled();
      expect(ui.showError).toHaveBeenCalledWith(error, 'bouquets.orderFailed');
      expect(component['isOrdering']()).toBe(false);
    });
  });

  it('goes back step by step', () => {
    component['onDetails'](rose);
    component['back']();
    expect(component['mode']()).toBe('list');

    component['back']();
    expect(component['mode']()).toBe('search');
  });
});
