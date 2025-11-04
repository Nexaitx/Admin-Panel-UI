import { Component, inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-pharma-medicines',
  imports: [
    CommonModule,
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
    MatMenuModule,
    MatDatepickerModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './pharma-medicines.html',
  styleUrl: './pharma-medicines.scss',
  providers: [provideNativeDateAdapter()],
})
export class PharmaMedicines {
  selectedMedicineType: string = 'manually-added-medicines';
  selectedMedicine: any;

  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('discountDialog') discountDialog!: TemplateRef<any>;
  @ViewChild('mrpDialog') mrpDialog!: TemplateRef<any>;
  @ViewChild('availabilityDialog') availabilityDialog!: TemplateRef<any>;

  medicineForm!: FormGroup;
  discountForm!: FormGroup;
  editing: boolean = false;
  checkedToggle: boolean = false;
  editingMedicineId: number | null = null;

  locations = ['State A', 'State B', 'City C', 'City D'];
  selection = new SelectionModel<any>(true, []);
  medicines: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  editingRow: any = null;

  // displayedColumns: string[] = [
  //   'select', 's_no',
  //   'id',
  //   'name', 'mrp', 'type',
  //   'productForm', 'actions'
  // ];

  displayedManualMedicineColumns: string[] = [
    'select', 's_no',
    'medicineId', 'name', 'category', 'quantityInStock', 'mrp',
    'discountPercentage',  'price', 'active', 'actions'
  ];


  // displayedDiscountedMedicineColumns: string[] = [
  //   'select', 's_no',
  //   'productId', 'productName', 'productType', 'originalPrice', 'discountPrice',
  //   'discountPercentage', 'isAvailable', 'managedAt', 'updatedAt', 'adminId',
  //   'adminName', 'adminEmail', 'adminPhoneNumber', 'adminCreatedAt', 'actions'
  // ];

  http = inject(HttpClient);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  currentPage: number = 0;
  pageSize: number = 5;

  constructor(private fb: FormBuilder) {
    this.medicineForm = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      price: [0, [Validators.required, Validators.min(0)]],
      quantityInStock: [0, [Validators.min(0)]],
      category: [null, Validators.required],
      manufacturer: [null],
      expiryDate: [null],
      genderRestriction: [null],
      minAge: [0, [Validators.min(0)]],
      maxAge: [0, [Validators.min(0)]],
      uses: [null],
      precautions: [null],
      sideEffects: [null],
      brandName: [null],
      dosage: [null],
      prescription_required: [false],
      showInApp: [false],
      product_form: [null],
      how_to_use: [null],
      safety_advise: [null],
      common_side_effec: [null],
      pregnancy_interaction: [null],
      how_it_works: [null],
      storage: [null],
      medicine_type: [null],
      salt_composition: [null],
      images: this.fb.array([]),
      setFirstImageAsPrimary: [false]
    });

    this.discountForm = this.fb.group({
      productId: [{ value: null, disabled: true }, Validators.required],
      productType: [null],
      isAvailable: [true],
      discountPercentage: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit() {
    this.onMedicineTypeChange(this.selectedMedicineType);
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    // Initialize paginator and listen for page changes
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe(() => {
      this.onMedicineTypeChange(this.selectedMedicineType);
    });
  }

  onEdit(row: any) {
  this.editingRow = row;
  this.selectedMedicine = row;
  // maybe patch form here if you’re using a form
  // this.prescriptionForm.patchValue({...row});
}

onSave(row: any) {
  // if (this.prescriptionForm.valid) {
    // call your update logic here (API, etc)
    // after save success:
    this.editingRow = null;
    // this.getprescriptions();  // refresh data
  }
// }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  get images(): FormArray {
    return this.medicineForm.get('images') as FormArray;
  }

  addImageControl() {
    this.images.push(this.fb.control(null));
  }

  onFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const arr = this.medicineForm.get('images') as FormArray;
      arr.at(index).patchValue(file);
    }
  }

  removeImageControl(index: number) {
    this.images.removeAt(index);
  }

  // applySearchFilter(event: Event) {
  //   if (this.selectedMedicineType === 'otc') {
  //     const payload = {
  //       q: (event.target as HTMLInputElement).value,
  //       page: 0,
  //       size: 10
  //     };
  //     this.http.get(`${API_URL + ENDPOINTS.GET_SEARCH_OTC_MEDICINES}`, { params: payload })
  //       .subscribe((data: any) => {
  //         this.medicines = data.data.content || [];
  //         this.dataSource.data = this.medicines;
  //       });
  //   }
  //   if (this.selectedMedicineType === 'medicines') {
  //     const payload = {
  //       q: (event.target as HTMLInputElement).value,
  //       page: 0,
  //       size: 10
  //     };
  //     this.http.get(`${API_URL + ENDPOINTS.GET_SEARCH_PRESCRIBED_MEDICINES}`, { params: payload })
  //       .subscribe((data: any) => {
  //         this.medicines = data.data.content || [];
  //         this.dataSource.data = this.medicines;
  //       });
  //   }
  //   if (this.selectedMedicineType === 'manually-added-medicines') {
  //     const token = localStorage.getItem('token');
  //     let headers = new HttpHeaders();
  //     if (token) {
  //       headers = headers.set('Authorization', `Bearer ${token}`);
  //     }
  //     const payload = {
  //       name: (event.target as HTMLInputElement).value,
  //       page: 0,
  //       size: 10,
  //       sortBy: 'name',
  //       sortDirection: 'asc'
  //     };
  //     this.http.get(`${API_URL + ENDPOINTS.GET_SEARCH_MY_MEDICINES}`, { params: payload, headers })
  //       .subscribe((data: any) => {
  //         this.medicines = data?.data?.medicines || [];
  //         this.dataSource.data = this.medicines;
  //       });
  //   }
  // }
  applySearchFilter(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    const page = this.paginator ? this.paginator.pageIndex : 0;
    const size = this.paginator ? this.paginator.pageSize : 10;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (this.selectedMedicineType === 'otc') {
      const payload = {
        q: searchValue,
        page: page.toString(),
        size: size.toString()
      };
      this.http.get(`${API_URL + ENDPOINTS.GET_SEARCH_OTC_MEDICINES}`, { params: payload, headers })
        .subscribe((data: any) => {
          this.medicines = data.data.content || [];
          this.dataSource.data = this.medicines;
          if (this.paginator && data.data.totalElements) {
            this.paginator.length = data.data.totalElements;
          }
        }, error => {
          console.error('Error searching OTC medicines:', error);
          this.showError('Failed to search OTC medicines');
        });
    }

    if (this.selectedMedicineType === 'medicines') {
      const payload = {
        q: searchValue,
        page: page.toString(),
        size: size.toString()
      };
      this.http.get(`${API_URL + ENDPOINTS.GET_SEARCH_PRESCRIBED_MEDICINES}`, { params: payload, headers })
        .subscribe((data: any) => {
          this.medicines = data.data.content || [];
          this.dataSource.data = this.medicines;
          if (this.paginator && data.data.totalElements) {
            this.paginator.length = data.data.totalElements;
          }
        }, error => {
          console.error('Error searching prescribed medicines:', error);
          this.showError('Failed to search prescribed medicines');
        });
    }

    if (this.selectedMedicineType === 'manually-added-medicines') {
      const payload = {
        name: searchValue,
        page: page.toString(),
        size: size.toString(),
        sortBy: 'name',
        sortDirection: 'asc'
      };
      this.http.get(`${API_URL + ENDPOINTS.GET_SEARCH_MY_MEDICINES}`, { params: payload, headers })
        .subscribe((data: any) => {
          this.medicines = data?.data?.medicines || [];
          this.dataSource.data = this.medicines;
          if (this.paginator && data.totalElements) {
            this.paginator.length = data.totalElements;
          }
        }, error => {
          console.error('Error searching manually added medicines:', error);
          this.showError('Failed to search manually added medicines');
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

    // Clear existing images FormArray
    while (this.images.length) {
      this.images.removeAt(0);
    }

    // Populate images FormArray with existing image URLs
    if (m.imageUrls && Array.isArray(m.imageUrls)) {
      m.imageUrls.forEach((url: string) => {
        this.images.push(this.fb.control(url));
      });
    }

    // Patch other form values
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
      setFirstImageAsPrimary: m.setFirstImageAsPrimary
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
      prescription_required: form.prescription_required || false,
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

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (this.editing) {
      console.log(this.selectedMedicine?.medicineId)
      this.http.put(`${API_URL}${ENDPOINTS.UPDATE_MEDICINE}/${this.selectedMedicine?.medicineId}`, payload, { headers })
        .subscribe(response => {
          this.medicines = this.medicines.map(m => {
            if (m.medicineId === this.selectedMedicine?.medicineId) {
              return { ...m, ...payload };
            }
            return m;
          });
          this.dataSource.data = this.medicines;
          this.showSuccess('Medicine updated successfully');
        }, error => {
          console.error('Error updating medicine:', error);
          this.showError('Failed to update medicine');
        });
    } else {
      if (this.images.length > 0) {
        this.http.post(API_URL + ENDPOINTS.CREATE_MEDICINE, payload, { headers })
          .subscribe((response: any) => {
            this.medicines.push(response.data);
            this.dataSource.data = this.medicines;
            this.showSuccess('Medicine created successfully');
          }, error => {
            console.error('Error creating medicine:', error);
            this.showError('Failed to create medicine');
          });
      } else {
        payload.images = [];
        payload.setFirstImageAsPrimary = false;
        this.http.post(API_URL + ENDPOINTS.CREATE_MEDICINE_NO_IMAGE, payload, { headers })
          .subscribe((response: any) => {
            this.medicines.push(response.data);
            this.dataSource.data = this.medicines;
            this.showSuccess('Medicine created successfully');
          }, error => {
            console.error('Error creating medicine:', error);
            this.showError('Failed to create medicine');
          });
      }
    }

    this.editing = false;
    this.editingMedicineId = null;
    this.drawer.close();
  }

  // onMedicineTypeChange(selectedValue: string) {
  //   this.selectedMedicineType = selectedValue;
  //   this.checkedToggle = false;
  //   const token = localStorage.getItem('token');
  //   let headers = new HttpHeaders();
  //   if (token) {
  //     headers = headers.set('Authorization', `Bearer ${token}`);
  //   }
  //   const params = {
  //     page: this.currentPage.toString(),
  //     size: this.pageSize.toString()
  //   };

  //   if (selectedValue === 'otc') {
  //     this.dataSource.data = [];
  //     this.http.get(API_URL + ENDPOINTS.GET_OTC_MEDICINES, { headers, params })
  //       .subscribe((data: any) => {
  //         this.medicines = data.data.content || [];
  //         this.dataSource.data = this.medicines;
  //       });
  //   }

  //   if (selectedValue === 'medicines') {
  //     this.dataSource.data = [];
  //     this.http.get(API_URL + ENDPOINTS.GET_PRESCRIBED_MEDICINES, { headers, params })
  //       .subscribe((data: any) => {
  //         this.medicines = data.data.content || [];
  //         this.dataSource.data = this.medicines;
  //       });
  //   }

  //   if (selectedValue === 'manually-added-medicines') {
  //     this.dataSource.data = [];
  //     this.http.get(API_URL + ENDPOINTS.GET_MY_MEDICINES, { headers, params })
  //       .subscribe((data: any) => {
  //         this.medicines = data?.medicines || [];
  //         this.dataSource.data = this.medicines;
  //       });
  //   }
  // }

  onMedicineTypeChange(selectedValue: string) {
    this.selectedMedicineType = selectedValue;
    this.checkedToggle = false;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const page = this.paginator ? this.paginator.pageIndex : 0;
    const size = this.paginator ? this.paginator.pageSize : 10;

    const params = {
      page: page.toString(),
      size: size.toString()
    };

    if (selectedValue === 'otc') {
      this.dataSource.data = [];
      this.http.get(API_URL + ENDPOINTS.GET_OTC_MEDICINES, { headers, params })
        .subscribe((data: any) => {
          this.medicines = data.data.content || [];
          this.dataSource.data = this.medicines;
          if (this.paginator && data.data.totalElements != null) {
            this.paginator.length = data.data.totalElements;
            const totalPages = data.data.totalPages || 1;
            if (this.paginator.pageIndex >= totalPages) {
              this.paginator.pageIndex = totalPages - 1;
              this.onMedicineTypeChange(this.selectedMedicineType);
            }
          }
        }, error => {
          console.error('Error fetching OTC medicines:', error);
          this.showError('Failed to load OTC medicines');
        });
    }

    if (selectedValue === 'medicines') {
      this.dataSource.data = [];
      this.http.get(API_URL + ENDPOINTS.GET_PRESCRIBED_MEDICINES, { headers, params })
        .subscribe((data: any) => {
          this.medicines = data.data.content || [];
          this.dataSource.data = this.medicines;
          if (this.paginator && data.data.totalElements != null) {
            this.paginator.length = data.data.totalElements;
            const totalPages = data.data.totalPages || 1;
            if (this.paginator.pageIndex >= totalPages) {
              this.paginator.pageIndex = totalPages - 1;
              this.onMedicineTypeChange(this.selectedMedicineType);
            }
          }
        }, error => {
          console.error('Error fetching prescribed medicines:', error);
          this.showError('Failed to load prescribed medicines');
        });
    }

    if (selectedValue === 'manually-added-medicines') {
      this.dataSource.data = [];
      this.http.get(API_URL + ENDPOINTS.GET_MY_MEDICINES, { headers, params })
        .subscribe((data: any) => {
          this.medicines = data?.medicines || [];
          this.dataSource.data = this.medicines;
          if (this.paginator && data.totalElements != null) {
            this.paginator.length = data.totalElements;
            const totalPages = data.totalPages || 1;
            if (this.paginator.pageIndex >= totalPages) {
              this.paginator.pageIndex = totalPages - 1;
              this.onMedicineTypeChange(this.selectedMedicineType);
            }
          }
        }, error => {
          console.error('Error fetching manually added medicines:', error);
          this.showError('Failed to load manually added medicines');
        });
    }
  }

  deleteMedicine(m: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete medicine ${m?.name || ''}?`,
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
        this.http.delete(`${API_URL + ENDPOINTS.DELETE_MEDICINE}${m?.medicineId}`, { headers })
          .subscribe(() => {
            this.medicines = this.medicines.filter(x => x?.medicineId !== m?.medicineId);
            this.dataSource.data = this.medicines;
            this.showSuccess('Medicine deleted successfully');
          }, error => {
            console.error('Delete failed:', error);
            this.showError('Failed to delete medicine');
          });
      }
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }

  toggleDiscountedMedicines(event: any) {
    const checked = event.checked;
    this.checkedToggle = checked;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (checked) {
      this.selectedMedicineType = '';
      const page = this.paginator ? this.paginator.pageIndex : 0;
      const size = this.paginator ? this.paginator.pageSize : 10;
      const params = {
        page: page.toString(),
        size: size.toString()
      };
      this.dataSource.data = [];
      this.http.get(`${API_URL + ENDPOINTS.GET_DISCOUNTED_MEDICINES}`, { headers, params })
        .subscribe((data: any) => {
          this.medicines = data || [];
          this.dataSource.data = this.medicines;
          if (this.paginator && data.totalElements) {
            this.paginator.length = data.totalElements;
          }
        }, error => {
          this.showError('Failed to load discounted medicines');
        });
    } else {
      this.dataSource.data = [];
      this.onMedicineTypeChange(this.selectedMedicineType);
    }
  }

  openDiscountDialog() {
    // this.selectedMedicine = m;
    // this.discountForm.patchValue({
    //   productId: m.productId || m.id,
    //   productType: m.productType || m.type,
    //   isAvailable: m.isAvailable !== undefined ? m.isAvailable : true,
    //   discountPercentage: m.discountPercentage || 0
    // });

    const dialogRef = this.dialog.open(this.discountDialog, {
      width: '400px',
      data: { form: this.discountForm }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveDiscount();
      }
    });
  }

  openAvailabilityDialog() {
    const dialogRef = this.dialog.open(this.availabilityDialog, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveAvailability();
      }
    });
  }

  openMRPDialog(m: any) {
    const dialogRef = this.dialog.open(this.mrpDialog, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveMRP();
      }
    });
  }

  saveMRP() {
  }

  saveAvailability() {
    const medId = this.selection?.selected.map(med => med.productId || med.medicineId || med.id);
    let payload = {
      showInApp: true,
      id: medId
    }
    console.log('Payload for availability toggle:', payload);
    // this.http.post(`${API_URL}${ENDPOINTS.BULK_AVAILABILITY_TOGGLE}`, payload)
    //   .subscribe(response => {
    //     this.dataSource.data = this.medicines;
    //     this.showSuccess('Availability updated successfully');
    //   }, error => {
    //     console.error('Error updating availability:', error);
    //     this.showError('Failed to update availability');
    //   });
  }

  saveDiscount() {
    if (this.discountForm.invalid) {
      return;
    }

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const medId = this.selection?.selected.map(med => med.productId || med.medicineId || med.id);

    const payload = {
      productId: medId,
      discountPercentage: this.discountForm.value.discountPercentage
    };
    console.log('Payload for discount update:', payload);
    this.http.post(`${API_URL}${ENDPOINTS.BULK_DISCOUNT}`, payload, { headers })
      .subscribe(response => {
        this.toggleDiscountedMedicines({ checked: true });
        this.dataSource.data = this.medicines;
        this.showSuccess('Discount updated successfully');
      }, error => {
        this.showError('Failed to update discount');
      });
  }
}