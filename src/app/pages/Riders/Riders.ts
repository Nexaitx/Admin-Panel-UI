import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { RidersOwners } from './riders-owners/riders-owners';
import { Riders } from './riders/riders';

@Component({
  selector: 'app-riders',
  standalone: true,
  imports: [
    MatTabsModule,
    RidersOwners,
    Riders
  ],
  templateUrl: './Riders.html',
  styleUrls: ['./Riders.css']
})
export class RidersComponent {

  tab: string = 'owners';

  onTabChange(index: number) {
    this.tab = index === 0 ? 'owners' : 'riders';
  }

}