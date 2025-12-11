import { HttpClient } from '@angular/common/http';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { ColumnDef, CommonTableComponent } from '../../shared/common-table/common-table.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bulk-assignment',
  standalone: true,
  imports: [
    CommonModule,
    CommonTableComponent,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './bulk-assignment.html',
  styleUrl: './bulk-assignment.scss'
})
export class BulkAssignment {
  http = inject(HttpClient);
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild('staffDialog') staffDialog!: TemplateRef<any>;
  selectedStaffDetails: any[] = [];
  selectedRecord: any;
  dialog = inject(MatDialog);
  @ViewChild(CommonTableComponent) commonTable!: CommonTableComponent;

  commonColumns: ColumnDef[] = [
    { key: 'userId', header: 'User&nbsp;Id', sortable: true },
    { key: 'userName', header: 'User&nbsp;Name', sortable: true },
    { key: 'userPhoneNumber', header: 'User&nbsp;Phone', sortable: true },
    { key: 'viewBookings', header: 'Staffs', type: 'action', sortable: false }
  ];
  staffsColumns: ColumnDef[] = [
    { key: 'staffId', header: 'Staff Id' },
    { key: 'name', header: 'Staff Name' },
    { key: 'phoneNumber', header: 'Staff Phone' },
    { key: 'category', header: 'Category' },
    { key: 'subCategory', header: 'SubCategory' },
    { key: 'gender', header: 'Gender' },
    { key: 'status', header: 'Status' }
  ];
  staffDetailsColumns: ColumnDef[] = [...this.staffsColumns];
  staffDetailsColumnKeys: string[] = this.staffDetailsColumns.map(c => c.key);


  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get(API_URL + ENDPOINTS.GET_BULK_BOOKINGS).subscribe((res: any) => {
      this.dataSource.data = res || [];
    },
      (err) => {
        console.error('Error fetching data:', err);
      });
  }

  onRowView(row: any) {
    this.selectedRecord = row;
    this.selectedStaffDetails = row?.staffs || [];
    if (this.selectedStaffDetails.length) {
      const presentKeys = new Set(Object.keys(this.selectedStaffDetails[0]));
      const filtered = this.staffsColumns.filter(col => presentKeys.has(col.key));
      this.staffDetailsColumnKeys = filtered.map(col => col.key);
      this.staffDetailsColumns = filtered;
    } else {
      this.staffDetailsColumns = [...this.staffsColumns];
      this.staffDetailsColumnKeys = this.staffDetailsColumns.map(c => c.key);
    }
    this.dialog.open(this.staffDialog, { width: '900px', minWidth: '800px' });
  }

}