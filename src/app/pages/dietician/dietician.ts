import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DietPlan } from './diet-plan/diet-plan';
import { MatTabsModule } from '@angular/material/tabs';
import { DieticiansList } from './dieticians-list/dieticians-list';
import { SubscriptionPlan } from './subscription-plan/subscription-plan';

@Component({
  selector: 'app-dietician',
  imports: [
    CommonModule,
    DietPlan,
    MatTabsModule,
    DieticiansList,
    SubscriptionPlan
  ],
  templateUrl: './dietician.html',
  styleUrl: './dietician.scss'
})
export class Dietician {

}
