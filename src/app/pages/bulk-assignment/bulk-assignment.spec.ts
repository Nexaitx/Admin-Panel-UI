import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAssignment } from './bulk-assignment';

describe('BulkAssignment', () => {
  let component: BulkAssignment;
  let fixture: ComponentFixture<BulkAssignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkAssignment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkAssignment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
