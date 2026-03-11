import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ENDPOINTS, PHARMA_API_URL } from '../../../core/const';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-account-settings',
  imports: [MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.scss',
})
export class AccountSettings {
  private http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'id',
    'deviceId',
    'deviceType',
    'adminId',
    'fcmToken',
    'actions'
  ];

  ngOnInit() {
    this.getPharmaAccounts();
  }

  getPharmaAccounts() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.get(PHARMA_API_URL + ENDPOINTS.GET_ALL_DEVICES_OF_PHARMACY, { headers }).subscribe((res: any) => {
      const devices = res.devices.map((device: any) => ({
        ...device,
        isPrimary: device.fcmToken !== 'null' && device.fcmToken !== null
      }));
      this.dataSource.data = devices;
    });
  }

  // change notification settings
  updateFCM(row: any) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    if (row.isPrimary === 'true') {

      const payload = {
        deviceId: String(row.id),
        fcmToken: row.fcmToken,
        deviceType: row.deviceType
      };

      this.http.post(
        PHARMA_API_URL + ENDPOINTS.REGISTER_FCM,
        payload, { headers }
      ).subscribe();
      this.getPharmaAccounts();
    } else {

      const payload = {
        deviceId: String(row.id),
        fcmToken: 'null',
        deviceType: 'null'
      };

      this.http.put(
        PHARMA_API_URL + ENDPOINTS.UPDATE_FCM + row.id,
        payload, { headers }
      ).subscribe();
      this.getPharmaAccounts();
    }
  }
}
