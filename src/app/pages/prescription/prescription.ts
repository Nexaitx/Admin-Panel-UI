import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { API_URL, ENDPOINTS } from '../../core/const';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatFormFieldModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './prescription.html',
  styleUrls: ['./prescription.scss']
})
export class Prescriptions {
  http = inject(HttpClient);
  fb = inject(FormBuilder)
  prescriptions = new MatTableDataSource<any>([]);
  @ViewChild('drawer') drawer!: MatDrawer;
  prescriptionForm!: FormGroup;
  isDrawerOpen = false;
  selectedRecord: any;
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);
  statuses: any;
  isEdit: boolean = false;

  cartColumns: string[] = [
    'prescriptionId', 'medicineId', 'medicineName', 'medicineType', 'userId', 'userName', 'userPhoneNumber', 'address', 'actions'
  ];

  constructor() {
    this.prescriptionForm = this.fb.group({
      status: ['', Validators.required],
      remarks: ['']
    });
  }

  ngOnInit() {
    this.getPrescriptionStatuses();
    this.getprescriptions();
  }

  getprescriptions() {
    const page = 0;
    const size = 10;
    const sortBy = 'uploadDate';
    const direction = 'desc';

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    this.http.get(API_URL + ENDPOINTS.GET_PRESCRIPTIONS, { headers, params }).subscribe((res: any) => {
      this.prescriptions.data = res.data;
    });
  }

  getPrescriptionStatuses() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.get(API_URL + ENDPOINTS.GET_PRESCRIPTION_STATUSES, { headers }).subscribe((res: any) => {
      this.statuses = res.data;
    });
  }

  applyCartFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.prescriptions.filter = filterValue.trim().toLowerCase();

    if (this.prescriptions.paginator) {
      this.prescriptions.paginator.firstPage();
    }
  }

  onOpen() {
    if (this.isEdit) {
      this.prescriptionForm.patchValue(this.selectedRecord);
    }
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }

  onDrawerClosed() {
    this.selectedRecord = null;
  }

  onSubmit() {
    console.log(this.selectedRecord)
    if (this.prescriptionForm.valid) {
      const token = localStorage.getItem('token');
      let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      if (this.isEdit) {
        this.http.put(`${API_URL}${ENDPOINTS.UPDATE_PRESCRIPTION_STATUS}${this.selectedRecord?.prescriptionId}/status`, this.prescriptionForm.value, { headers }).subscribe((res: any) => {
          this.getprescriptions();
          this.snackBar.open('Address succesfully Updated', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        },
          err =>
            this.snackBar.open('Failed to update Address', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error']

            })
        );
      }
      else {
        this.http.post(API_URL + ENDPOINTS.ADD_ADDRESS, this.prescriptionForm.value, { headers }).subscribe((res: any) => {
          this.prescriptionForm.reset();
          this.getprescriptions();
          this.snackBar.open('Company Address added successfully', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        });
      }
    }
    else {
      this.snackBar.open('Failed to add Address', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  }

  deleteElement(m: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete Address?`,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders();
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        this.http.delete(`${API_URL + ENDPOINTS.DELETE_ADDRESS}${m?.id}`, { headers })
          .subscribe(() => {
            this.prescriptions.data = this.prescriptions.data.filter(x => x?.medicineId !== m?.medicineId);
            this.snackBar.open('Company Address deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          }, error => {
            this.snackBar.open('Failed to Address', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          });
      }
    });
  }
}
