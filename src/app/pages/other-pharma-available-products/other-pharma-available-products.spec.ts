import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPharmaAvailableProducts } from './other-pharma-available-products';

describe('OtherPharmaAvailableProducts', () => {
  let component: OtherPharmaAvailableProducts;
  let fixture: ComponentFixture<OtherPharmaAvailableProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherPharmaAvailableProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherPharmaAvailableProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
