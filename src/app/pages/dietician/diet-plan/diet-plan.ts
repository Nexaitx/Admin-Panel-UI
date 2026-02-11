import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialog } from '../../confirmation-dialog/confirmation-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    FormsModule,
    MatCheckboxModule,
    MatDialogModule
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
  jwt = localStorage.getItem('token');

  displayedColumns: string[] = ['s_no', 'dietPlanId', 'planType', 'title', 'dietPreference', 'gender', 'minAge', 'maxAge', 'activityLevel', 'imageUrls', 'active', 'actions'];

  dietPlans: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild('imageDialog') imageDialog!: TemplateRef<any>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  constructor(private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dietPlanForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      category: [''],
      durationDays: [null],
      caloriesPerDay: [null],
      subscriptionType: [''],
      targetAudience: [''],
      difficultyLevel: [''],
      mealType: ['BREAKFAST'],
      foodAllergies: [''],
      snacksDetails: [''],
      dinnerDetails: [''],
      lunchDetails: [''],
      breakfastDetails: [''],
      precautions: [''],
      benefits: [''],
      images: [null],
      setFirstImageAsPrimary: [false],
      breakfastJson: this.fb.array([]),
      lunchJson: this.fb.array([]),
      dinnerJson: this.fb.array([]),
      snacksJson: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (this.role === 'Admin') {
      this.selectedValue = 'all';
    }
    if (this.role === 'Dietician') {
      this.selectedValue = 'myDietPlans';
    }
    this.getMyDietPlans();
    // this.getDietPlans();
    // this.dietPlans.filterPredicate = (data: any, filter: string): boolean => {
    //   const dataStr = `${data.planType} ${data.dietPreference} ${data.gender} ${data.minAge} ${data.maxAge} ${data?.foodAvoid} ${data.activityLevel}`.toLowerCase();
    //   return dataStr.includes(filter.toLowerCase());
    // };
  }

  ngAfterViewInit(): void {
    this.dietPlans.sort = this.sort;
    this.dietPlans.paginator = this.paginator;
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const input = event.target as HTMLInputElement;
    console.log(input);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedFiles.push(file);

        const previewUrl = URL.createObjectURL(file);
        this.imagePreviews.push(previewUrl);
      }
      this.dietPlanForm.get('images')?.setValue(this.selectedFiles);

      event.target.value = '';
    }
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    this.dietPlanForm.get('images')?.setValue(this.selectedFiles.length ? this.selectedFiles : null);
  }

  createMealItem(type: string): FormGroup {
    return this.fb.group({
      mealType: [type],
      foodItem: ['', Validators.required],
      quantity: [''],
      calories: [0],
      protein: [0],
      carbs: [0],
      fats: [0],
      description: [''],
      mealOrder: [1]
    });
  }

  // Getter for easy access in HTML
  getMealArray(name: string) {
    return this.dietPlanForm.get(name) as FormArray;
  }

  addMealRow(arrayName: string, type: string) {
    this.getMealArray(arrayName).push(this.createMealItem(type));
  }

  removeMealRow(arrayName: string, index: number) {
    this.getMealArray(arrayName).removeAt(index);
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

  onSubmission() {
    if (this.dietPlanForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    const formValue = this.dietPlanForm.value;

    // 1. Loop through form keys and append to FormData
    Object.keys(formValue).forEach(key => {
      const value = formValue[key];

      if (key === 'images') {
        this.selectedFiles.forEach((file) => {
          formData.append('images', file, file.name);
        });
      } else if (Array.isArray(value) || (value !== null && typeof value === 'object')) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwt}`
    });

    if (!this.isEdit) {
      this.http.post(API_URL + ENDPOINTS.CREATE_DIETPLAN, formData, { headers }).subscribe({
        next: (res: any) => {
          this.getMyDietPlans();
          this.snackBar.open('Diet plan created successfully!', 'Close', { duration: 3000 });
          this.closeUserDrawer();
          this.dietPlanForm.reset();
          this.selectedFiles = [];
          this.imagePreviews = [];
        },
        error: err => {
          console.error(err);
          this.snackBar.open('Error creating diet plan.', 'Close', { duration: 3000 });
        }
      });
    } else {
      // If your Edit also supports images, use the same 'formData' object here instead of 'this.dietPlanForm.value'
      this.http.put(`${API_URL}${ENDPOINTS.UPDATE_DIETPLAN}${this.selectedRecord.id}`, formData, { headers }).subscribe({
        next: (res: any) => {
          const updatedData = this.dietPlans.data.map((item) => item.id === this.selectedRecord.id ? res : item);
          this.getMyDietPlans();
          this.snackBar.open('Diet plan updated successfully!', 'Close', { duration: 3000 });
          this.closeUserDrawer();
        },
        error: err => console.error(err)
      });
    }
  }

  // getDietPlans() {
  //   console.log(this.selectedValue);
  //   if (this.selectedValue === 'myDietPlans') {
  //     this.http.get(API_URL + ENDPOINTS.GET_ALL_LOGGEDIN_DIETICIAN_DIET_PLANS, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }).subscribe({
  //       next: (res: any) => {
  //         this.dietPlans.data = res;
  //         this.mapAndSetDataSource(this.dietPlans.data);
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         this.snackBar.open('Error fetching diet plans. Please try again.', 'Close', {
  //           duration: 3000,
  //           panelClass: ['snackbar-error']
  //         });
  //       }
  //     });
  //   }
  //   if (this.selectedValue === 'active') {
  //     this.http.get(API_URL + ENDPOINTS.GET_DIETPLAN).subscribe({
  //       next: (res: any) => {
  //         this.dietPlans.data = res;
  //         this.mapAndSetDataSource(this.dietPlans.data);
  //       },
  //       error: (err) => {
  //       }
  //     });
  //   }
  //   if (this.selectedValue === 'all') {
  //     this.http.get(API_URL + ENDPOINTS.GET_ALL_ACTIVE_DIET_PLANS).subscribe({
  //       next: (res: any) => {
  //         this.dietPlans.data = res;
  //         this.mapAndSetDataSource(this.dietPlans.data);
  //       },
  //       error: (err) => {
  //       }
  //     });
  //   }
  // }

  getMyDietPlans() {
    this.http.get(API_URL + ENDPOINTS.GET_MY_DIET_PLAN, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }).subscribe({
      next: (res: any) => {
        this.dietPlans.data = res.dietPlans;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error fetching my diet plans. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  addImageToDietPlan() {
    const dietPlanid = this.selectedRecord?.dietPlanId;
    const formData = new FormData();
    this.selectedFiles.forEach((file) => {
      formData.append('files[]', file, file.name);
    });
    if (this.selectedFiles.length > 0) {
      formData.append('file', this.selectedFiles[0], this.selectedFiles[0].name);
    }
    this.http.post(`${API_URL}${ENDPOINTS.ADD_IMAGE_DIET_PLAN}${dietPlanid}/images`, formData, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }).subscribe({
      next: (res: any) => {
        this.snackBar.open('Image added successfully!', 'Close', { duration: 3000 });
        this.getMyDietPlans();
        this.selectedFiles = [];
        this.imagePreviews = [];
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Error adding image. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  deleteImageFromDietPlan(dietPlanId: number, imageId: number) {
    this.http.delete(`${API_URL}${ENDPOINTS.DELETE_DIET_PLAN_IMAGE}${dietPlanId}/images/${imageId}`, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }).subscribe({
      next: (res: any) => {
        this.snackBar.open('Image deleted successfully!', 'Close', { duration: 3000 });
        this.getMyDietPlans();
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Error deleting image. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }


  openModel(element: any) {
    this.selectedRecord = element;
    this.selectedFiles = [];
    this.imagePreviews = [];
    const dialogRef = this.dialog.open(this.imageDialog, {
      width: '800px' + (element?.imageUrls?.length * 100) + 'px',
      data: { element }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  confirmDelete(element: any, url: string) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete this diet plan Image? This action cannot be undone.`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const imageId = element?.imageid
        if (imageId) {
           this.deleteImageFromDietPlan(element?.dietPlanId, parseInt(imageId));
        }
      }
   });
  }
}