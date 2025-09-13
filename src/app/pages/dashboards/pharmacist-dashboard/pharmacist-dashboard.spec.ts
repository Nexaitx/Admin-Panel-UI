import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacistDashboard } from './pharmacist-dashboard';

describe('PharmacistDashboard', () => {
  let component: PharmacistDashboard;
  let fixture: ComponentFixture<PharmacistDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacistDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacistDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
