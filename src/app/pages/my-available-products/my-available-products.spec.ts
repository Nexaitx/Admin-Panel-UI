import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAvailableProducts } from './my-available-products';

describe('MyAvailableProducts', () => {
  let component: MyAvailableProducts;
  let fixture: ComponentFixture<MyAvailableProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAvailableProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAvailableProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
