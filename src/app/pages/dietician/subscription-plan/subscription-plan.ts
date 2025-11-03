import { Component, inject, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-subscription-plan',
  standalone: true,
  imports: [
    MatCardModule,
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
    ReactiveFormsModule
  ],
  templateUrl: './subscription-plan.html',
  styleUrls: ['./subscription-plan.scss']
})
export class SubscriptionPlan implements AfterViewInit {
  http = inject(HttpClient);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);

  isDrawerOpen: boolean = false;
  isEdit: boolean = false;
  selectedRecord: any;
  dietPlanForm: FormGroup;
  dietPlans: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('userDrawer') userDrawer!: MatDrawer;

  displayedColumns: string[] = [
    's_no',
    'planType',
    'tenure',
    'title',
    'description',
    'keyFeatures',
    'actions'
  ];

  constructor() {
    this.dietPlanForm = this.fb.group({
      planType: ['', Validators.required],
      tenure: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      keyFeatures: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getDietPlans();
    this.dietPlans.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = `${data.planType} ${data.tenure} ${data.title} ${data.description} ${
        data.keyFeatures?.join(', ') || ''
      }`.toLowerCase();
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
        this.http.delete(API_URL + ENDPOINTS.DELETE_DIET_SUBSCRIPTION + '/' + element.id).subscribe({
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

  openUserDrawer(element?: any) {
    this.isEdit = !!element;
    if (this.isEdit) {
      this.selectedRecord = element;
      const keyFeatures = element.keyFeatures && Array.isArray(element.keyFeatures) && element.keyFeatures.length
        ? element.keyFeatures
        : [''];
      this.dietPlanForm.patchValue({
        planType: element.planType,
        tenure: element.tenure,
        title: element.title,
        description: element.description
      });
      this.keyFeatures.clear();
      keyFeatures.forEach((feature: any) => {
        this.addKeyFeature(feature);
      });
    } else {
      this.dietPlanForm.reset();
      this.keyFeatures.clear();
      this.addKeyFeature();
    }
    this.isDrawerOpen = true;
  }

  closeUserDrawer() {
    this.isDrawerOpen = false;
    this.selectedRecord = null;
    this.isEdit = false;
    this.dietPlanForm.reset();
  }

  addKeyFeature(value?: string) {
    this.keyFeatures.push(this.fb.control(value || '', Validators.required));
  }

  removeKeyFeature(index: number) {
    if (this.keyFeatures.length > 1) {
      this.keyFeatures.removeAt(index);
    }
  }

  onSubmission() {
    if (this.dietPlanForm.invalid) {
      this.dietPlanForm.markAllAsTouched();
      return;
    }
    if (!this.isEdit) {
      this.http.post(API_URL + ENDPOINTS.CREATE_DIET_SUBSCRIPTION, this.dietPlanForm.value).subscribe({
        next: (res: any) => {
          this.dietPlans.data = [...this.dietPlans.data, res];
          this.snackBar.open('Diet plan created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.closeUserDrawer();
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Error creating diet plan. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      this.http.put(`${API_URL}${ENDPOINTS.UPDATE_DIET_SUBSCRIPTION}${this.selectedRecord.id}`, this.dietPlanForm.value).subscribe({
        next: (res: any) => {
          this.dietPlans.data = this.dietPlans.data.map(item =>
            item.id === this.selectedRecord.id ? res : item
          );
          this.snackBar.open('Diet plan updated successfully!', 'Close', {
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

  getDietPlans() {
    this.http.get(API_URL + ENDPOINTS.GET_DIET_SUBSCRIPTION).subscribe({
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

    mapAndSetDataSource(data: any[]): void {
    const mappedData: any[] = data.map(data => ({
      planType: data.planType,
      title: data.title,
      tenure: data.tenure,
      description: data.description,
      keyFeatures: data.keyFeatures,
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

  get keyFeatures() {
    return this.dietPlanForm.get('keyFeatures') as FormArray;
  }
}