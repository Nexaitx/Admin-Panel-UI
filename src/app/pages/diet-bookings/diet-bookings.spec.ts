import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietBookings } from './diet-bookings';

describe('DietBookings', () => {
  let component: DietBookings;
  let fixture: ComponentFixture<DietBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietBookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DietBookings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
