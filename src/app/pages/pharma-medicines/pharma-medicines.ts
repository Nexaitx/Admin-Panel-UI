import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pharma-medicines',
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatMenuModule
  ],
  templateUrl: './pharma-medicines.html',
  styleUrl: './pharma-medicines.scss'
})
export class PharmaMedicines {
  selectedMedicineType: string = 'manually-added-medicines';

  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  medicineForm!: FormGroup;
  editing = false;
  editingMedicineId: number | null = null;

  locations = ['State A', 'State B', 'City C', 'City D'];

  medicines: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'breadcrumbs', 'countryOfOrigin', 'directionsForUse', 'expiration', 'id',
    'imageUrls', 'information', 'keyBenefits', 'keyIngredients',
    'manufacturerAddress', 'manufacturerDetails', 'manufacturers',
    'marketerDetails', 'mrp', 'name', 'packageInfo', 'packaging',
    'productForm', 'productHighlights', 'qty', 'safetyInformation', 'type', 'actions']
  http = inject(HttpClient);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      quantityInStock: [0, [Validators.min(0)]],
      category: ['', Validators.required],
      manufacturer: [''],
      expiryDate: [''],
      genderRestriction: [''],
      minAge: [0, [Validators.min(0)]],
      maxAge: [0, [Validators.min(0)]],
      uses: [''],
      precautions: [''],
      sideEffects: [''],
      brandName: [''],
      dosage: [''],
      prescription_required: [false],
      showInApp: [false],
      product_form: [''],
      how_to_use: [''],
      safety_advise: [''],
      common_side_effec: [''],
      pregnancy_interaction: [''],
      how_it_works: [''],
      storage: [''],
      medicine_type: [''],
      salt_composition: [''],
      images: this.fb.array([]),
      setFirstImageAsPrimary: [false]
    });
  }

  ngOnInit() {
    // this.loadMedicines();
    this.onMedicineTypeChange(this.selectedMedicineType)
    this.dataSource.paginator = this.paginator;
  }

  get images(): FormArray {
    return this.medicineForm.get('images') as FormArray;
  }

  addImageControl() {
    (this.medicineForm.get('images') as FormArray).push(this.fb.control(null));
  }

  onFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const arr = this.medicineForm.get('images') as FormArray;
      console.log('Selected file for index', index, file);
      arr.at(index).patchValue(file);
    }
  }
  removeImageControl(index: number) {
    this.images.removeAt(index);
  }

  applySearchFilter(event: Event) {
    if (this.selectedMedicineType === 'otc') {
      const payload = {
        q: (event.target as HTMLInputElement).value,
        page: 0,
        size: 10
      }
      this.http.get(`${API_URL + ENDPOINTS.GET_SEARCH_OTC_MEDICINES}`, { params: payload })
        .subscribe((data: any) => {
          this.medicines = data.data.content || [];
          this.dataSource.data = this.medicines;
        });
    }
    if (this.selectedMedicineType === 'medicines') {
      const payload = {
        q: (event.target as HTMLInputElement).value,
        page: 0,
        size: 10
      }
      this.http.get(`${API_URL + ENDPOINTS.GET_SEARCH_PRESCRIBED_MEDICINES}`, { params: payload })
        .subscribe((data: any) => {
          this.medicines = data.data.content || [];
          this.dataSource.data = this.medicines;
        });
    }
    if (this.selectedMedicineType === 'manually-added-medicines') {
      const token = localStorage.getItem('token');
      let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      const payload = {
        name: (event.target as HTMLInputElement).value,
        page: 0,
        size: 10,
        sortBy: 'name',
        sortDirection: 'asc'
      }
      this.http.get(`${API_URL + ENDPOINTS.GET_SEARCH_MY_MEDICINES}`, { params: payload, headers })
        .subscribe((data: any) => {
          this.medicines = data?.data?.medicines || [];
          this.dataSource.data = this.medicines;
        });
    }

  }

  openCreate() {
    this.editing = false;
    this.editingMedicineId = null;
    this.medicineForm.reset();
    this.drawer.open();
  }

  openEdit(m: any) {
    this.editing = true;
    this.editingMedicineId = m.id ?? null;
    this.medicineForm.patchValue({
      name: m.name,
      description: m.description,
      price: m.price,
      quantityInStock: m.quantityInStock,
      category: m.category,
      manufacturer: m.manufacturer,
      expiryDate: m.expiryDate,
      genderRestriction: m.genderRestriction,
      minAge: m.minAge,
      maxAge: m.maxAge,
      uses: m.uses,
      precautions: m.precautions,
      sideEffects: m.sideEffects,
      brandName: m.brandName,
      dosage: m.dosage,
      prescription_required: m.prescription_required,
      showInApp: m.showInApp,
      product_form: m.product_form,
      how_to_use: m.how_to_use,
      safety_advise: m.safety_advise,
      common_side_effec: m.common_side_effec,
      pregnancy_interaction: m.pregnancy_interaction,
      how_it_works: m.how_it_works,
      storage: m.storage,
      medicine_type: m.medicine_type,
      salt_composition: m.salt_composition,
      setFirstImageAsPrimary: m.setFirstImageAsPrimary,
      images: []
    });
    this.drawer.open();
  }

  onSubmit() {
    if (this.medicineForm.invalid) {
      return;
    }

    const form = this.medicineForm.value;
    const payload: any = {
      name: form.name || '',
      description: form.description || '',
      price: form.price || 0,
      quantityInStock: form.quantityInStock || 0,
      category: form.category || '',
      manufacturer: form.manufacturer || '',
      expiryDate: form.expiryDate || '',
      genderRestriction: form.genderRestriction || '',
      minAge: form.minAge || 0,
      maxAge: form.maxAge || 0,
      uses: form.uses || '',
      precautions: form.precautions || '',
      sideEffects: form.sideEffects || '',
      brandName: form.brandName || '',
      dosage: form.dosage || '',
      prescription_required: form.prescription_required || '',
      showInApp: form.showInApp || false,
      product_form: form.product_form || '',
      how_to_use: form.how_to_use || '',
      safety_advise: form.safety_advise || '',
      common_side_effec: form.common_side_effec || '',
      pregnancy_interaction: form.pregnancy_interaction || '',
      how_it_works: form.how_it_works || '',
      storage: form.storage || '',
      medicine_type: form.medicine_type || '',
      salt_composition: form.salt_composition || '',
      setFirstImageAsPrimary: form.setFirstImageAsPrimary || false,
      images: form.images || []
    };

    if (this.editing && this.editingMedicineId != null) {
      this.http.put(`${API_URL}${ENDPOINTS.UPDATE_MEDICINE}/${this.editingMedicineId}`, payload)
        .subscribe(response => {
          this.medicines = this.medicines.map(m => {
            if (m.medicineId === this.editingMedicineId) {
              return { ...m, ...payload };
            }
            return m;
          });
          this.dataSource.data = this.medicines;
          this.showSuccess('Medicine updated successfully');
        },
          error => {
            console.error('Error fetching medicines:', error);
            this.showError('Failed to fetch medicines');
          });
    } else {
      console.log('Creating medicine with payload:', payload);
      const token = localStorage.getItem('token');
      let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      if (this.images.length > 0) {
        this.http.post(API_URL + ENDPOINTS.CREATE_MEDICINE, payload, { headers })
          .subscribe((response: any) => {
            this.medicines.push(response.data);
            this.dataSource.data = this.medicines;
            this.showSuccess('Medicine created successfully');
          },
            error => {
              console.error('Error fetching medicines:', error);
              this.showError('Failed to fetch medicines');
            });
      }
      else {
        payload.images = [];
        payload.setFirstImageAsPrimary = false;
        this.http.post(API_URL + ENDPOINTS.CREATE_MEDICINE_NO_IMAGE, payload, { headers })
          .subscribe((response: any) => {
            this.medicines.push(response.data);
            this.dataSource.data = this.medicines;
            this.showSuccess('Medicine created successfully');
          },
            error => {
              console.error('Error fetching medicines:', error);
              this.showError('Failed to fetch medicines');
            });
      }

      this.editing = false;
      this.editingMedicineId = null;
      this.drawer.close();
    }
  }


  onMedicineTypeChange(selectedValue: string) {
    this.selectedMedicineType = selectedValue;
    if (selectedValue === 'otc') {
      this.http.get(API_URL + ENDPOINTS.GET_OTC_MEDICINES).subscribe((data: any) => {
        this.medicines = data.data.content || [];
        this.dataSource.data = this.medicines;
      });
    }

    if (selectedValue === 'medicines') {
      this.http.get(API_URL + ENDPOINTS.GET_PRESCRIBED_MEDICINES).subscribe((data: any) => {
        this.medicines = data.data.content || [];
        this.dataSource.data = this.medicines;
      });
    }

    if (selectedValue === 'manually-added-medicines') {
      const token = localStorage.getItem('token');
      let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      this.http.get(API_URL + ENDPOINTS.GET_MY_MEDICINES, { headers })
        .subscribe((data: any) => {
          this.medicines = data?.medicines || [];
          this.dataSource.data = this.medicines;
        });
    }
  }

  deleteMedicine(m: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete medicine ${m.name || ''}?`,
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
        this.http.delete(`${API_URL + ENDPOINTS.DELETE_MEDICINE}${m.medicineId}`, { headers }).subscribe(() => {
          this.medicines = this.medicines.filter(x => x.medicineId !== m.medicineId);
          this.dataSource.data = this.medicines;
          this.showSuccess('Medicine deleted successfully');
        },
          error => {
            console.error('Delete failed:', error);
            this.showError('Failed to delete medicine');
          });
      }
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success']  // optional custom style
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }

}
