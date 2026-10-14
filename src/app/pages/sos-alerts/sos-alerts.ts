import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../core/const';
import { pushMessages$ } from '../../core/services/push-notification';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sos-alerts',
  imports: [CommonTableComponent, MatFormFieldModule, MatSelectModule],
  templateUrl: './sos-alerts.html',
  styleUrl: './sos-alerts.scss',
})
export class SosAlerts implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<any>();
  http = inject(HttpClient);

  private _pushSub?: Subscription;
  selectedStatus = 'all';

  columns: ColumnDef[] = [
    { key: 'alertId', header: 'Alert&nbsp;Id', sortable: true },
    { key: 'contact1', header: 'Contact&nbsp;Person&nbsp;One', sortable: true },
    { key: 'contact2', header: 'Contact&nbsp;Person&nbsp;Two', sortable: true },
    { key: 'triggeredAt', header: 'Triggered&nbsp;At', sortable: true, type: 'date' },
    { key: 'resolvedAt', header: 'Resolved&nbsp;At', sortable: true, type: 'date' },
    { key: 'resolvedBy', header: 'Resolved&nbsp;By', sortable: true },
    { key: 'location', header: 'Location', sortable: true },
    { key: 'resolved', header: 'Status', sortable: true },
    { key: 'resolve', header: 'Action', type: 'actionResolveSOS' }
  ];

  ngOnInit(): void {
    this.fetchData();

    this._pushSub = pushMessages$.subscribe({
      next: (msg: any) => {
        const payload = msg?.payload ?? msg;
        const title =
          payload?.notification?.title ?? payload?.data?.title ?? payload?.title;

        if (title === 'SOS' || title === 'SOS alert') {
          this.fetchData();
        }
      },
      error: (err: any) => console.warn('Push notification error:', err)
    });
  }

  ngOnDestroy(): void {
    this._pushSub?.unsubscribe();
  }

  fetchData(status?: string): void {
  if (status) this.selectedStatus = status;

  let endpoint: string;
  if (this.selectedStatus === 'all') endpoint = API_URL + ENDPOINTS.GET_SOS;
  else if (this.selectedStatus === 'pending') endpoint = API_URL + ENDPOINTS.GET_SOS_PENDING;
  else endpoint = API_URL + ENDPOINTS.GET_SOS_RESOLVED;

  this.http.get<any>(endpoint).subscribe({
    next: (res: any) => {
      const data = Array.isArray(res)
        ? res
        : res?.data ?? res?.content ?? res?.results ?? res?.alerts ?? [];

      //  keep `resolved` as boolean — CommonTable isi pe toggle chalata hai
      this.dataSource.data = data.map((item: any) => ({
        ...item,
        resolved: item.resolved === true || item.resolved === 'Resolved' || item.resolved === 1
      }));
    },
    error: (error: any) => {
      console.error('SOS API Error:', error);
      this.dataSource.data = [];
    }
  });
}

onResolve(row: any): void {
  const alertId = row.alertId ?? row.id;

  if (alertId == null) {
    console.error('SOS alert ID is missing:', row);
    return;
  }

  const url = `${API_URL}${ENDPOINTS.RESOLVE_SOS}/${alertId}`;
  const params = { resolvedBy: 'admin' };  //  query param as per API doc

  this.http.put(url, null, { params }).subscribe({
    next: () => {
      //  Toggle button instantly — no popup, no refresh needed
      row.resolved = true;
      row.resolvedBy = 'admin';
      row.resolvedAt = new Date();

      this.fetchData();  //  refresh from server (optional but recommended)
    },
    error: (err: any) => {
      console.error('Resolve SOS failed:', err);
    }
  });
}
}