import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpComingBooking } from './up-coming-booking';

describe('UpComingBooking', () => {
  let component: UpComingBooking;
  let fixture: ComponentFixture<UpComingBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpComingBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpComingBooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
