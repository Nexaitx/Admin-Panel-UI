import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPharmaAvailableProducts } from './all-pharma-available-products';

describe('AllPharmaAvailableProducts', () => {
  let component: AllPharmaAvailableProducts;
  let fixture: ComponentFixture<AllPharmaAvailableProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPharmaAvailableProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPharmaAvailableProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
