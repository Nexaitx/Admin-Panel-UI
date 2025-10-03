import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ClientIndividual } from './client-individual/client-individual';
import { ClientOrganization } from './client-organization/client-organization';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    MatTabsModule,
    ClientIndividual,
    ClientOrganization
  ],
  templateUrl: './client.html',
  styleUrls: ['./client.css']
})
export class Client {
  client: string = 'individual';

  onTabChange(index: number) {
    if (index === 0) {
      this.client = 'individual';
    } else if (index === 1) {
      this.client = 'organization';
    }
  }
}