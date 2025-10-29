import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsAddress } from './accounts-address';

describe('AccountsAddress', () => {
  let component: AccountsAddress;
  let fixture: ComponentFixture<AccountsAddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsAddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsAddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
