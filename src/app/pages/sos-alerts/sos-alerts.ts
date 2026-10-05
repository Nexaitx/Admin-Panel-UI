import { Component, inject } from '@angular/core';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../core/const';
import { pushMessages$ } from '../../core/services/push-notification';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-sos-alerts',
  imports: [
    CommonTableComponent,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './sos-alerts.html',
  styleUrl: './sos-alerts.scss',
})
export class SosAlerts {
  dataSource = new MatTableDataSource<any>();
  http = inject(HttpClient);
  private _pushSub: any;
  selectedStatus: string = 'all';

  columns: ColumnDef[] = [
    { key: 'alertId', header: 'Alert&nbsp;Id', sortable: true },
    { key: 'contact1', header: 'Contact&nbsp;Person&nbsp;One', sortable: true },
    { key: 'contact2', header: 'Contact&nbsp;Person&nbsp;Two', sortable: true },
    { key: 'triggeredAt', header: 'Triggered&nbsp;At', sortable: true, type: 'date' },
    { key: 'resolvedAt', header: 'Resolved&nbsp;At', sortable: true, type: 'date' },
    { key: 'resolvedBy', header: 'Resolved&nbsp;By', sortable: true },
    { key: 'location', header: 'Location', sortable: true },
    { key: 'resolved', header: 'Status', sortable: true },
  ];

  ngOnInit() {
    this.fetchData();
    try {
      this._pushSub = pushMessages$.subscribe((msg: any) => {
        const payload = msg?.payload || msg;

        console.log('Push Payload:', payload);

        const title =
          payload?.notification?.title ||
          payload?.data?.title ||
          payload?.title;

        alert(`New App Message: ${title || 'New message'}`);

        if (title === 'SOS' || title === 'SOS alert') {
          this.fetchData();
        }
      });
    } catch (e) {
      console.warn('Failed to subscribe to push messages', e);
    }
  }

  ngOnDestroy() {
    try {
      if (this._pushSub && typeof this._pushSub.unsubscribe === 'function') {
        this._pushSub.unsubscribe();
      }
    } catch (e) { }
  }

  fetchData(status?: string) {
    if (status) {
      this.selectedStatus = status;
    }

    let endpoint = '';

    if (this.selectedStatus === 'all') {
      endpoint = API_URL + ENDPOINTS.GET_SOS;
    } else if (this.selectedStatus === 'pending') {
      endpoint = API_URL + ENDPOINTS.GET_SOS_PENDING;
    } else if (this.selectedStatus === 'resolved') {
      endpoint = API_URL + ENDPOINTS.GET_SOS_RESOLVED;
    }

    this.http.get(endpoint).subscribe({
      next: (res: any) => {
        console.log('SOS API Response:', res);

        // Handle array or wrapped API response
        const data = Array.isArray(res)
          ? res
          : res?.data || res?.content || res?.results || res?.alerts || [];

        console.log('SOS Table Data:', data);

        this.dataSource.data = data.map((item: any) => ({
          ...item,
          resolved: item.resolved ? 'Resolved' : 'Pending'
        }));
      },
      error: (error) => {
        console.error('SOS API Error:', error);
        this.dataSource.data = [];
      }
    });
  }

}
