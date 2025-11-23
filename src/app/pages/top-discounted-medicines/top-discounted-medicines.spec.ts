import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopDiscountedMedicines } from './top-discounted-medicines';

describe('TopDiscountedMedicines', () => {
  let component: TopDiscountedMedicines;
  let fixture: ComponentFixture<TopDiscountedMedicines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopDiscountedMedicines]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopDiscountedMedicines);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
