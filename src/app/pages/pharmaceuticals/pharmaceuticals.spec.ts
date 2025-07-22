import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pharmaceuticals } from './pharmaceuticals';

describe('Pharmaceuticals', () => {
  let component: Pharmaceuticals;
  let fixture: ComponentFixture<Pharmaceuticals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pharmaceuticals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pharmaceuticals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
