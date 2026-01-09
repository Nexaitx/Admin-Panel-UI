import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubroleAccounts } from './subrole-accounts';

describe('SubroleAccounts', () => {
  let component: SubroleAccounts;
  let fixture: ComponentFixture<SubroleAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubroleAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubroleAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
