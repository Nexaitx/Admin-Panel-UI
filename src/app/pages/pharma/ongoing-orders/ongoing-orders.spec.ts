import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingOrders } from './ongoing-orders';

describe('OngoingOrders', () => {
  let component: OngoingOrders;
  let fixture: ComponentFixture<OngoingOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngoingOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
