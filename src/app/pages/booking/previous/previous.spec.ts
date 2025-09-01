import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Previous } from './previous';

describe('Previous', () => {
  let component: Previous;
  let fixture: ComponentFixture<Previous>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Previous]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Previous);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
