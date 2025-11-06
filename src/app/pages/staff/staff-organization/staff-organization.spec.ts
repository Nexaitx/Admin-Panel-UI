import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffOrganization } from './staff-organization';

describe('StaffOrganization', () => {
  let component: StaffOrganization;
  let fixture: ComponentFixture<StaffOrganization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffOrganization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffOrganization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
