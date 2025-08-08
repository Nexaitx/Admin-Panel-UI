import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { API_URL, ENDPOINTS } from '../../core/const';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink,
    MatButtonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})

export class Dashboard {
  http = inject(HttpClient)
  role = localStorage.getItem('role');
  clients: any;
  staffs: any;
  dietPlans: any;
  doctors: any;
  dieticians: any;
  pharmacist: any;

  ngOnInit() {
    this.getData();
  }

  getData() {
    // get dietplans
    this.http.get(API_URL + ENDPOINTS.GET_DIETPLAN).subscribe((res: any) => {
      this.dietPlans = res;
    });

    // get dieticians
    this.http.get(API_URL + ENDPOINTS.GET_ACCOUNT_BY_ROLE + 'Dietician').subscribe((res: any) => {
      this.dieticians = res;
    });

    // get Doctors
    this.http.get(API_URL + ENDPOINTS.GET_ACCOUNT_BY_ROLE + 'Admin').subscribe((res: any) => {
      this.doctors = res;
    });

  }
}
