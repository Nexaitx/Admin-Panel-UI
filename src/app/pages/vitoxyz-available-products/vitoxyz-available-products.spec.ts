import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitoxyzAvailableProducts } from './vitoxyz-available-products';

describe('VitoxyzAvailableProducts', () => {
  let component: VitoxyzAvailableProducts;
  let fixture: ComponentFixture<VitoxyzAvailableProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitoxyzAvailableProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VitoxyzAvailableProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
