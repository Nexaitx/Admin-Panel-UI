import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletTransactions } from './wallet-transactions';

describe('WalletTransactions', () => {
  let component: WalletTransactions;
  let fixture: ComponentFixture<WalletTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
