import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffWallet } from './staff-wallet';

describe('StaffWallet', () => {
  let component: StaffWallet;
  let fixture: ComponentFixture<StaffWallet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffWallet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffWallet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
