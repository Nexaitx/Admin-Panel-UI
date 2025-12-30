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
        const payload = msg && msg.payload ? msg.payload : msg;
        const title = payload?.notification?.title || payload?.data?.title || payload?.title;
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
  // Update the property if a new status is passed, otherwise use current
  if (status) {
    this.selectedStatus = status;
  }

  let endpoint = '';
  
  // 1. Determine the endpoint
  if (this.selectedStatus === 'all') {
    endpoint = API_URL + ENDPOINTS.GET_SOS;
  } else if (this.selectedStatus === 'pending') {
    endpoint = API_URL + ENDPOINTS.GET_SOS_PENDING;
  } else if (this.selectedStatus === 'resolved') {
    endpoint = API_URL + ENDPOINTS.GET_SOS_RESOLVED;
  }

  // 2. Execute request and format data
  this.http.get(endpoint).subscribe((res: any) => {
    this.dataSource.data = res.reverse().map((item: any) => ({
      ...item,
      resolved: item.resolved ? 'Resolved' : 'Pending'
    }));
  });
}
}
