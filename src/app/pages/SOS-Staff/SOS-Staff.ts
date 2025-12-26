import { Component, inject } from '@angular/core';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../core/const';
import { pushMessages$ } from '../../core/services/push-notification';

@Component({
  selector: 'app-SOS-Staff',
  imports: [CommonTableComponent],
  templateUrl: './SOS-Staff.html',
  styleUrl: './SOS-Staff.scss'
})
export class SOSStaff {
  columns: ColumnDef[] = [
    { key: 'staffId', header: 'Staff&nbsp;ID', sortable: true },
    { key: 'staffName', header: 'Staff&nbsp;Name', sortable: true },
    { key: 'staffPhoneNumber', header: 'Staff&nbsp;Phone&nbsp;Number', sortable: true },
    { key: 'staffEmail', header: 'Staff&nbsp;Email', sortable: true },
    { key: 'sosContact1', header: 'Contact&nbsp;Person&nbsp;1', sortable: true },
    { key: 'sosContact2', header: 'Contact&nbsp;Person&nbsp;2', sortable: true }
  ];
  dataSource = new MatTableDataSource<any>();
  http = inject(HttpClient);
  private _pushSub: any;

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

  fetchData() {
    this.http.get(API_URL + ENDPOINTS.GET_SOS_FROM_STAFF).subscribe((res: any) => {
      this.dataSource.data = res.data.reverse();
    })
  }
}
