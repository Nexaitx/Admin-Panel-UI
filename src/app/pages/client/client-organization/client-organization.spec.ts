import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOrganization } from './client-organization';

describe('ClientOrganization', () => {
  let component: ClientOrganization;
  let fixture: ComponentFixture<ClientOrganization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientOrganization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientOrganization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
