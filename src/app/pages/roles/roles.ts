import { Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient } from '@angular/common/http';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-roles',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.scss'
})
export class Roles {
  http = inject(HttpClient);
  fb = inject(FormBuilder);

  isDrawerOpen: boolean = false;
  isEdit: boolean = false;
  selectedRecord: any;
  rolesForm!: FormGroup;
  roles: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('userDrawer') userDrawer!: MatDrawer;

  displayedColumns: string[] = [
    's_no',
    'roleType',
    'actions'
  ];

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.rolesForm = this.fb.group({
      roleType: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getRoles();
    this.roles.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = `${data.roleType}`;
      return dataStr.includes(filter.toLowerCase());
    };
  }

  ngAfterViewInit(): void {
    this.roles.sort = this.sort;
    this.roles.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.roles.filter = filterValue.trim().toLowerCase();
    if (this.roles.paginator) {
      this.roles.paginator.firstPage();
    }
  }

deleteElement(element: any): void {
  const dialogRef = this.dialog.open(ConfirmationDialog, {
    width: '350px',
    data: {
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete the role "${element.roleType}"? This action cannot be undone.`,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }
  });
  // ... (previous code)

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.http.delete(API_URL + ENDPOINTS.DELETE_ROLE + element.id, { responseType: 'text' }).subscribe({
        next: (res: any) => {
          // The response is now a text string
          if (res === 'Role deleted successfully') {
            this.getRoles();
            this.snackBar.open('Role deleted successfully!', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          } else {
            // Handle unexpected text response
            this.snackBar.open('Error deleting role. Unexpected response.', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        },
        error: error => {
          console.error(error);
          this.snackBar.open('Error deleting role. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      // ... (rest of the code)
    }
  });
}

  openUserDrawer(element?: any) {
    this.isEdit = !!element;
    if (this.isEdit) {
      this.selectedRecord = element;
      this.rolesForm.patchValue({
        roleType: element.roleType,
      });
    } else {
      this.rolesForm.reset();
    }
    this.isDrawerOpen = true;
  }

  closeUserDrawer() {
    this.isDrawerOpen = false;
    this.selectedRecord = null;
    this.isEdit = false;
    this.rolesForm.reset();
  }


  onSubmission() {
    if (this.rolesForm.invalid) {
      this.rolesForm.markAllAsTouched();
      return;
    }
    if (!this.isEdit) {
      this.http.post(API_URL + ENDPOINTS.CREATE_ROLE, this.rolesForm.value).subscribe({
        next: (res: any) => {
          this.getRoles();
          this.snackBar.open('Role created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.closeUserDrawer();
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Error creating role. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      this.http.put(`${API_URL}${ENDPOINTS.UPDATE_ROLE}${this.selectedRecord.id}`, this.rolesForm.value).subscribe({
        next: (res: any) => {
          this.getRoles();
          this.snackBar.open('Role updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.closeUserDrawer();
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Error updating diet plan. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  }

  getRoles() {
    this.http.get(API_URL + ENDPOINTS.GET_ROLES).subscribe({
      next: (res: any) => {
        this.roles.data = res.role
        console.log(this.roles.data);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error fetching roles. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}