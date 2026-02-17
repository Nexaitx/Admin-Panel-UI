import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLedgers } from './order-ledgers';

describe('OrderLedgers', () => {
  let component: OrderLedgers;
  let fixture: ComponentFixture<OrderLedgers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderLedgers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderLedgers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
