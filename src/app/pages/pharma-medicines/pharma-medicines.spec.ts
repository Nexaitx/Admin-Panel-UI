import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaMedicines } from './pharma-medicines';

describe('PharmaMedicines', () => {
  let component: PharmaMedicines;
  let fixture: ComponentFixture<PharmaMedicines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmaMedicines]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmaMedicines);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
