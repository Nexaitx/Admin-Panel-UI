import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pharmacist } from './pharmacist';

describe('Pharmacist', () => {
  let component: Pharmacist;
  let fixture: ComponentFixture<Pharmacist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pharmacist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pharmacist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
