import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidersOwners } from './riders-owners';

describe('RidersOwners', () => {
  let component: RidersOwners;
  let fixture: ComponentFixture<RidersOwners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RidersOwners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RidersOwners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
