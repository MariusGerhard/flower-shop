import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RessetPassComponent } from './reset.component';

describe('RessetPassComponent', () => {
  let component: RessetPassComponent;
  let fixture: ComponentFixture<RessetPassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RessetPassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RessetPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
