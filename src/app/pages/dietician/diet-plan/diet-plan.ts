import { Component, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-diet-plan',
  imports: [MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatMenuModule,
    MatSidenavModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './diet-plan.html',
  styleUrl: './diet-plan.scss',
})
export class DietPlan {
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  role = localStorage.getItem('role') || '';

  isDrawerOpen: boolean = false;
  isEdit: boolean = false;
  selectedRecord: any;
  selectedValue: string = '';
  dietPlanForm: FormGroup;

  displayedColumns: string[] = ['planType', 'title', 'dietPreference', 'gender', 'minAge', 'maxAge', 'activityLevel', 'active', 'actions'];

  dietPlans: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dietPlanForm = this.fb.group({
      planType: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      dietPreference: ['', Validators.required],
      gender: ['', Validators.required],
      minAge: [null, [Validators.min(0)]],
      maxAge: [null, [Validators.min(0)]],
      foodAvoid: [''],
      activityLevel: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.role === 'Admin') {
      this.selectedValue = 'all';
    }
    if (this.role === 'Dietician') {
      this.selectedValue = 'myDietPlans';
    }
    this.getDietPlans();
    this.dietPlans.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = `${data.planType} ${data.dietPreference} ${data.gender} ${data.minAge} ${data.maxAge} ${data?.foodAvoid} ${data.activityLevel}`.toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };
  }

  ngAfterViewInit(): void {
    this.dietPlans.sort = this.sort;
    this.dietPlans.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dietPlans.filter = filterValue.trim().toLowerCase();
    if (this.dietPlans.paginator) {
      this.dietPlans.paginator.firstPage();
    }
  }

  deleteElement(element: any): void {
    console.log(element);
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the diet plan "${element.title}"? This action cannot be undone.`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(API_URL + ENDPOINTS.DELETE_DIETPLAN + element.id)
          .subscribe({
            next: () => {
              this.dietPlans.data = this.dietPlans.data.filter(item => item.id !== element.id);
              this.snackBar.open('Diet plan deleted successfully!', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-success']
              });
            },
            error: err => {
              console.error(err);
              this.snackBar.open('Error deleting diet plan. Please try again.', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error']
              });
            }
          });

      } else {
        this.snackBar.open('Deletion cancelled.', 'Close', {
          duration: 2000,
        });
      }
    });
  }


  openUserDrawer(element: any) {
    if (this.isEdit) {
      this.selectedRecord = element;
      this.dietPlanForm.patchValue(element);
    }
    this.selectedRecord = element;
    this.isDrawerOpen = true;
  }

  closeUserDrawer() {
    this.isDrawerOpen = false;
    this.selectedRecord = null;
  }

  mapAndSetDataSource(data: any[]): void {
    const mappedData: any[] = data.map(data => ({
      planType: data.planType,
      title: data.title,
      description: data.description,
      dietPreference: data.dietPreference,
      gender: data.gender,
      minAge: data.minAge,
      maxAge: data.maxAge,
      foodAvoid: data.foodAvoid,
      activityLevel: data.activityLevel,
      active: data.active,
      id: data.id
    }));

    this.dietPlans.data = mappedData;
    if (this.sort) {
      this.dietPlans.sort = this.sort;
    }
    if (this.paginator) {
      this.dietPlans.paginator = this.paginator;
    }
  }

  onSubmission() {
    if (!this.isEdit) {
      this.http.post(API_URL + ENDPOINTS.CREATE_DIETPLAN, this.dietPlanForm.value).subscribe((res: any) => {
        const newRecord = [res];
        this.mapAndSetDataSource([...this.dietPlans.data, ...newRecord]);
        this.snackBar.open('Diet plan Creating successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
        err => {
          console.error(err);
          this.snackBar.open('Error creating diet plan. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        })
    }
    if (this.isEdit) {
      this.http.put(`${API_URL}${ENDPOINTS.DELETE_DIETPLAN}${this.selectedRecord.id}`, this.dietPlanForm.value).subscribe((res: any) => {
        const updatedData = this.dietPlans.data.map((item) =>
          item.id === this.selectedRecord.id ? res : item
        );
        this.mapAndSetDataSource(updatedData);
        this.snackBar.open('Diet plan Updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
        err => {
          console.error(err);
          this.snackBar.open('Error updating diet plan. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        })
    }
  }

  getDietPlans() {
    console.log(this.selectedValue);
    if (this.selectedValue === 'myDietPlans') {
      this.http.get(API_URL + ENDPOINTS.GET_ALL_LOGGEDIN_DIETICIAN_DIET_PLANS, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }).subscribe({
        next: (res: any) => {
          this.dietPlans.data = res;
          this.mapAndSetDataSource(this.dietPlans.data);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error fetching diet plans. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
    if (this.selectedValue === 'active') {
      this.http.get(API_URL + ENDPOINTS.GET_DIETPLAN).subscribe({
        next: (res: any) => {
          this.dietPlans.data = res;
          this.mapAndSetDataSource(this.dietPlans.data);
        },
        error: (err) => {
        }
      });
    }
    if (this.selectedValue === 'all') {
      this.http.get(API_URL + ENDPOINTS.GET_ALL_ACTIVE_DIET_PLANS).subscribe({
        next: (res: any) => {
          this.dietPlans.data = res;
          this.mapAndSetDataSource(this.dietPlans.data);
        },
        error: (err) => {
        }
      });
    }
  }
}