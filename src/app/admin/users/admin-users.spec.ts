import { TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { of } from 'rxjs';

import {
  FirebaseMock,
  UiMock,
  createFirebaseMock,
  createUiMock,
  provideFirebaseMock,
  testUser,
} from '../../../testing/firebase-mock';
import { AdminUsers } from './admin-users';

const anna = testUser({ id: 'u1', lastName: 'Blume', role: 'user', countOrders: 5 });
const ben = testUser({ id: 'u2', firstName: 'Ben', lastName: 'Stiel', role: 'employee', countOrders: 1 });
const cara = testUser({ id: 'u3', firstName: 'Cara', lastName: 'Dorn', role: 'admin', countOrders: undefined });

describe('AdminUsers', () => {
  let firebase: FirebaseMock;
  let ui: UiMock;
  let component: AdminUsers;

  const rowIds = () => component['dataSource'].data.map((u) => u.id);

  beforeEach(() => {
    firebase = createFirebaseMock();
    firebase.watchUsers.mockReturnValue(of([anna, ben, cara]));
    ui = createUiMock();
    TestBed.configureTestingModule({ imports: [AdminUsers], providers: provideFirebaseMock(firebase, ui) });
    component = TestBed.createComponent(AdminUsers).componentInstance;
  });

  it('does not load users before a search', () => {
    TestBed.tick();
    expect(firebase.watchUsers).not.toHaveBeenCalled();
  });

  it('shows all users', () => {
    component['showAll']();
    TestBed.tick();

    expect(rowIds()).toEqual(['u1', 'u2', 'u3']);
    expect(component['mode']()).toBe('list');
    expect(component['isLoading']()).toBe(false);
  });

  it('filters by role (case-insensitive)', () => {
    component['onSearch']({ value: { role: 'Employee' } } as NgForm);
    TestBed.tick();

    expect(rowIds()).toEqual(['u2']);
  });

  it('filters by minimum number of orders', () => {
    component['onSearch']({ value: { counter: '2' } } as NgForm);
    TestBed.tick();
    expect(rowIds()).toEqual(['u1']);

    component['onSearch']({ value: { counter: '0' } } as NgForm);
    TestBed.tick();
    expect(rowIds()).toEqual(['u1', 'u2', 'u3']);
  });

  it('subscribes to the users only once across searches', () => {
    component['showAll']();
    TestBed.tick();
    component['onSearch']({ value: { role: 'Admin' } } as NgForm);
    TestBed.tick();

    expect(firebase.watchUsers).toHaveBeenCalledOnce();
  });

  it('stores the new role in lower case', async () => {
    component['onEdit'](ben);
    component['newRole'].set('User');

    await component['onChangeRole']();

    expect(firebase.updateUser).toHaveBeenCalledWith('u2', { role: 'user' });
    expect(ui.notify).toHaveBeenCalledWith('adminUsers.updated', { name: 'Ben Stiel' });
    expect(component['mode']()).toBe('list');
  });

  it('does nothing without a selected role', async () => {
    component['onEdit'](ben);

    await component['onChangeRole']();

    expect(firebase.updateUser).not.toHaveBeenCalled();
  });

  it('deletes a user only after confirmation', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    await component['onDelete'](anna);
    expect(firebase.deleteUser).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    await component['onDelete'](anna);
    expect(firebase.deleteUser).toHaveBeenCalledWith('u1');
  });
});
