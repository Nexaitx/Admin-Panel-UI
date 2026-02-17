import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-order-reports',
  imports: [MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressBarModule
  ],
  templateUrl: './order-reports.html',
  styleUrl: './order-reports.scss',
})
export class OrderReports {

  onRangeChange(event: any) {
    const range = event.value;
    // Logic to calculate dates for Today, Week, or Month
    console.log("Filtering for:", range);
  }
}
