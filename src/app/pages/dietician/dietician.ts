import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DietPlan } from './diet-plan/diet-plan';
import { MatTabsModule } from '@angular/material/tabs';
import { DieticiansList } from './dieticians-list/dieticians-list';

@Component({
  selector: 'app-dietician',
  imports: [
    CommonModule,
    DietPlan,
    MatTabsModule,
    DieticiansList
  ],
  templateUrl: './dietician.html',
  styleUrl: './dietician.scss'
})
export class Dietician {

}
