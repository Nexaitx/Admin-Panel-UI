import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandoverOrder } from './handover-order';

describe('HandoverOrder', () => {
  let component: HandoverOrder;
  let fixture: ComponentFixture<HandoverOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandoverOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandoverOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
