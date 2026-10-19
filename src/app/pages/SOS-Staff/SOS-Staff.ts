import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../core/const';
import { pushMessages$ } from '../../core/services/push-notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-SOS-Staff',
  imports: [CommonTableComponent],
  templateUrl: './SOS-Staff.html',
  styleUrl: './SOS-Staff.scss'
})
export class SOSStaff implements OnInit, OnDestroy {
  columns: ColumnDef[] = [
    { key: 'staffId', header: 'Staff&nbsp;ID', sortable: true },
    { key: 'staffName', header: 'Staff&nbsp;Name', sortable: true },
    { key: 'staffPhoneNumber', header: 'Staff&nbsp;Phone&nbsp;Number', sortable: true },
    { key: 'staffEmail', header: 'Staff&nbsp;Email', sortable: true },
    { key: 'sosContact1', header: 'Contact&nbsp;Person&nbsp;1', sortable: true },
    { key: 'sosContact2', header: 'Contact&nbsp;Person&nbsp;2', sortable: true },
    { key: 'resolve', header: 'Action', type: 'actionResolveSOS' }
  ];

  dataSource = new MatTableDataSource<any>();
  http = inject(HttpClient);
  private _pushSub?: Subscription;

  ngOnInit(): void {
    this.fetchData();

    this._pushSub = pushMessages$.subscribe({
      next: (msg: any) => {
        const payload = msg?.payload ?? msg;
        const title = payload?.notification?.title ?? payload?.data?.title ?? payload?.title;
        if (title === 'SOS' || title === 'SOS alert') {
          this.fetchData();
        }
      },
      error: (err) => console.warn('Push subscription error:', err)
    });
  }

  ngOnDestroy(): void {
    this._pushSub?.unsubscribe();
  }

 fetchData(): void {
  this.http.get<any>(API_URL + ENDPOINTS.GET_SOS_FROM_STAFF).subscribe({
    next: (res: any) => {
      const data = Array.isArray(res) ? res : res?.data ?? [];
      this.dataSource.data = [...data].reverse().map((item: any) => ({
        ...item,
        resolved: item.resolved === true || item.resolved === 'Resolved' || item.resolved === 1
      }));
    },
    error: (err) => {
      console.error('Fetch SOS-Staff failed:', err);
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
  const params = { resolvedBy: 'admin' };

  this.http.put(url, null, { params }).subscribe({
    next: () => {
      row.resolved = true;
      row.resolvedBy = 'admin';
      row.resolvedAt = new Date();
      this.fetchData();
    },
    error: (err: any) => {
      console.error('Resolve SOS failed:', err);
    }
  });
}
}