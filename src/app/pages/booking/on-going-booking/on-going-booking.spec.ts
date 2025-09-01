import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnGoingBooking } from './on-going-booking';

describe('OnGoingBooking', () => {
  let component: OnGoingBooking;
  let fixture: ComponentFixture<OnGoingBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnGoingBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnGoingBooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
