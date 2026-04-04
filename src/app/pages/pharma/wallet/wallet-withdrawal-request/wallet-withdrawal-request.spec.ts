import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletWithdrawalRequest } from './wallet-withdrawal-request';

describe('WalletWithdrawalRequest', () => {
  let component: WalletWithdrawalRequest;
  let fixture: ComponentFixture<WalletWithdrawalRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletWithdrawalRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletWithdrawalRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
