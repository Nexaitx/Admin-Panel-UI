import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { User } from './user/user';
import { Staff } from './staff/staff';


@Component({
  selector: 'app-devices-and-addresses',
  imports: [
    MatTabsModule,
    User,
    Staff
  ],
  templateUrl: './devices-and-addresses.html',
  styleUrl: './devices-and-addresses.scss'
})

export class DevicesAndAddresses {
   selectedIndex: number = 0;

  onTabChange(event: any) {
    this.selectedIndex = event.index;
  }

}