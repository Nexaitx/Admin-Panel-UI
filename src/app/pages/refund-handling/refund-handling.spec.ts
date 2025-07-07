import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundHandling } from './refund-handling';

describe('RefundHandling', () => {
  let component: RefundHandling;
  let fixture: ComponentFixture<RefundHandling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundHandling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundHandling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
