import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffIndividual } from './staff-individual';

describe('StaffIndividual', () => {
  let component: StaffIndividual;
  let fixture: ComponentFixture<StaffIndividual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffIndividual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffIndividual);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
