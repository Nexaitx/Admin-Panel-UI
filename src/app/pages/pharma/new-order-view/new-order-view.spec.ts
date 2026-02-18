import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderView } from './new-order-view';

describe('NewOrderView', () => {
  let component: NewOrderView;
  let fixture: ComponentFixture<NewOrderView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewOrderView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOrderView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
