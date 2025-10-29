import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../core/const';

@Component({
  selector: 'app-kyc-under-process',
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './kyc-under-process.html',
  styleUrl: './kyc-under-process.scss'
})
export class KycUnderProcess {
  private router = inject(Router)
  private auth = inject(Auth);
  private http = inject(HttpClient);

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('userProfile') || '{}');
    this.http.get(API_URL + ENDPOINTS.GET_ADMIN_BY_ID + user.admin_id ).subscribe((res: any)=> {
      const response = res?.documentVerification;
      console.log(response);
    })
    // if(user.admin_id)
    // if (user.active === true) {
    //   this.router.navigate(['/app/pharmacist-dashboard']);
    // }
    setTimeout(() => {
      window.location.reload();
    }, 60000);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }
}
