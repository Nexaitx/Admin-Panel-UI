import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { StaffIndividual } from './staff-individual/staff-individual';
import { StaffOrganization } from './staff-organization/staff-organization';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
    MatTabsModule,
    StaffIndividual,
    StaffOrganization
  ],
  templateUrl: './staff.html',
  styleUrl: './staff.scss',
})
export class Staff {
  staff: string = 'individual';

  onTabChange(index: number) {
    if (index === 0) {
      this.staff = 'individual';
    } else if (index === 1) {
      this.staff = 'organization';
    }
  }
}