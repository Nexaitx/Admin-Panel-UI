import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyDetail } from './pharmacy-detail';

describe('PharmacyDetail', () => {
  let component: PharmacyDetail;
  let fixture: ComponentFixture<PharmacyDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
