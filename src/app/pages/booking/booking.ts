import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Previous } from './previous/previous';
import { UpComingBooking } from './up-coming-booking/up-coming-booking';
import { OnGoingBooking } from './on-going-booking/on-going-booking';

@Component({
  selector: 'app-booking',
  imports: [MatTabsModule,
    Previous,
    UpComingBooking,
    OnGoingBooking
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.scss'
})
export class Booking {
  activeBookingType: string = 'previous';

  onTabChange(index: number) {
    if (index === 0) {
      this.activeBookingType = 'previous';
    } else if (index === 1) {
      this.activeBookingType = 'onGoing';
    } else if (index === 2) {
      this.activeBookingType = 'upComing';
    }
  }

}
