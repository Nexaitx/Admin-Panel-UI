import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaDashboard } from './pharma-dashboard';

describe('PharmaDashboard', () => {
  let component: PharmaDashboard;
  let fixture: ComponentFixture<PharmaDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmaDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmaDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
