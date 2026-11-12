import { TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { of } from 'rxjs';

import { FirebaseMock, UiMock, createFirebaseMock, createUiMock, provideFirebaseMock } from '../../../testing/firebase-mock';
import { Bouquet } from '../../shared/models/bouquet.model';
import { AdminBouquets } from './admin-bouquets';

const rose: Bouquet = {
  id: 'b1',
  name: 'Rose Dream',
  category: 'Mum',
  description: null,
  flower: 'Rose',
  seasonStart: 1,
  seasonEnd: 12,
  price: 20,
  path: 'bouquets/b1.jpg',
};

/** Values as they come from the template-driven form (all strings) */
const formValue = {
  name: 'Tulip Joy',
  category: 'Friend',
  description: '',
  flower: 'Tulip',
  seasonStart: '3',
  seasonEnd: '5',
  price: '15.50',
};

describe('AdminBouquets', () => {
  let firebase: FirebaseMock;
  let ui: UiMock;
  let component: AdminBouquets;

  beforeEach(() => {
    firebase = createFirebaseMock();
    firebase.watchBouquets.mockReturnValue(of([rose]));
    ui = createUiMock();
    TestBed.configureTestingModule({ imports: [AdminBouquets], providers: provideFirebaseMock(firebase, ui) });
    component = TestBed.createComponent(AdminBouquets).componentInstance;
  });

  it('loads nothing until searched', () => {
    TestBed.tick();
    expect(firebase.watchBouquets).not.toHaveBeenCalled();
  });

  it('passes only the first filled search field', () => {
    component['onSearch']({ value: { flower: 'Rose' } } as NgForm);
    TestBed.tick();

    expect(firebase.watchBouquets).toHaveBeenLastCalledWith({ flower: 'Rose' });
    expect(component['dataSource'].data).toEqual([rose]);
    expect(component['isLoading']()).toBe(false);
  });

  it('converts form strings to numbers when adding', async () => {
    const form = { value: formValue, resetForm: vi.fn() } as unknown as NgForm;

    await component['onAdd'](form);

    expect(firebase.addBouquet).toHaveBeenCalledWith({
      name: 'Tulip Joy',
      category: 'Friend',
      description: null,
      flower: 'Tulip',
      seasonStart: 3,
      seasonEnd: 5,
      price: 15.5,
    });
    expect(form.resetForm).toHaveBeenCalled();
    expect(ui.showSnackbar).toHaveBeenCalledWith('Tulip Joy was added', undefined, 2500);
  });

  it('keeps the form filled when adding fails', async () => {
    firebase.addBouquet.mockRejectedValue(new Error('permission-denied'));
    const form = { value: formValue, resetForm: vi.fn() } as unknown as NgForm;

    await component['onAdd'](form);

    expect(form.resetForm).not.toHaveBeenCalled();
    expect(component['isLoading']()).toBe(false);
  });

  it('updates the bouquet that is being edited', async () => {
    component['onEdit'](rose);
    expect(component['mode']()).toBe('edit');

    await component['onUpdate']({ value: formValue } as unknown as NgForm);

    expect(firebase.updateBouquet).toHaveBeenCalledWith('b1', expect.objectContaining({ name: 'Tulip Joy', price: 15.5 }));
    expect(component['mode']()).toBe('list');
  });

  it('clears the edited bouquet when switching to add', () => {
    component['onEdit'](rose);
    component['startAdd']();

    expect(component['editing']()).toBeNull();
    expect(component['mode']()).toBe('add');
  });

  it('deletes bouquets and pictures only after confirmation', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    await component['onDelete'](rose);
    await component['deletePicture'](rose);
    expect(firebase.deleteBouquet).not.toHaveBeenCalled();
    expect(firebase.deleteBouquetPicture).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    await component['onDelete'](rose);
    await component['deletePicture'](rose);
    expect(firebase.deleteBouquet).toHaveBeenCalledWith('b1');
    expect(firebase.deleteBouquetPicture).toHaveBeenCalledWith(rose);
  });

  it('loads the picture URL from storage', async () => {
    await component['showPicture'](rose);

    expect(firebase.getPictureUrl).toHaveBeenCalledWith('bouquets/b1.jpg');
    expect(component['pictureUrl']()).toBe('https://example.test/pic.jpg');
  });
});
