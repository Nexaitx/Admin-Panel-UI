import {
  Component,
  ViewChild,
  inject,
  TemplateRef
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { API_URL, ENDPOINTS } from '../../../core/const';

@Component({
  selector: 'app-new-medicine',
  imports: [
  CommonModule,
  MatTableModule,
  FormsModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatDialogModule
],
  templateUrl: './new-medicine.html',
  styleUrl: './new-medicine.scss',
})
export class NewMedicine {

  dataSource = new MatTableDataSource<any>();
  http = inject(HttpClient);
  dialog = inject(MatDialog);

  pageIndex = 0;
pageSize = 10;
totalItems = 0;

  selectedMedicine: any = null;
  isMedicineLoading = false;
  isUpdatingMedicineStatus = false;
  selectedMedicineImage: string | null = null;
selectedMedicineImageName = '';

  selectedMedicineForEdit: any = null;
  editMedicineForm: any = {};
  isEditMedicineLoading = false;
  isSavingMedicine = false;
  hasEditChanges = false;

  @ViewChild('editMedicineDialog')
  editMedicineDialog!: TemplateRef<any>;

  private editDialogRef?: MatDialogRef<any>;

    @ViewChild('deleteMedicineDialog')
    deleteMedicineDialog!: TemplateRef<any>;

    private deleteDialogRef?: MatDialogRef<any>;

    selectedMedicineForDelete: any = null;
    isDeletingMedicine = false;

@ViewChild('detailsDialog')
detailsDialog!: TemplateRef<any>;
@ViewChild('medicineImageDialog')
medicineImageDialog!: TemplateRef<any>;

  displayedColumns: string[] = [
  's_no',
  'medicineId',
  'image',
  'name',
  'category',
  'manufacturer',
  'price',
  'quantityInStock',
  'addedByPharmacistName',
  'addedDate',
  'active'
];

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {

    const endpoint =
      API_URL +
      ENDPOINTS.GET_NEW_MEDICINE +
      '?isActive=all&isDeleted=all&page=0&size=10';

    this.http.get(endpoint).subscribe({
      next: (res: any) => {

        console.log('New Medicine API Response:', res);

        const medicines = res?.medicines || [];

        this.dataSource.data = medicines.map((item: any) => ({
          ...item,
          active: !!item.active
        }));

        console.log('New Medicine Table Data:', this.dataSource.data);
      },

      error: (error) => {
        console.error('New Medicine API Error:', error);
        this.dataSource.data = [];
      }
    });
  }

  onPageChange(event: PageEvent): void {

  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;

  this.fetchData();

}

applyFilter(event: Event): void {

  const filterValue =
    (event.target as HTMLInputElement).value;

  this.dataSource.filter =
    filterValue.trim().toLowerCase();

}

  openMedicineDetails(medicineId: number): void {
    console.log('Medicine ID clicked:', medicineId);

    this.selectedMedicine = {
      medicineId: medicineId
    };

    this.isMedicineLoading = true;

    this.dialog.open(this.detailsDialog, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });

    const url =
      `${API_URL}${ENDPOINTS.GET_NEW_MEDICINE_DETAILS}${medicineId}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('Medicine Details API Response:', res);

        // Keep the ID we already had from the table
        this.selectedMedicine = {
          ...res,
          medicineId: medicineId
        };

        this.isMedicineLoading = false;
      },
      error: (err) => {
        console.error('Error fetching medicine details:', err);
        this.isMedicineLoading = false;
        this.selectedMedicine = {
          medicineId: medicineId
        };
      }
    });
  }

  toggleMedicineStatus(): void {

  if (
    !this.selectedMedicine?.medicineId ||
    this.isUpdatingMedicineStatus
  ) {
    return;
  }

  const medicineId = this.selectedMedicine.medicineId;

  // Current status from API
  const currentStatus = !!this.selectedMedicine.active;

  // Send opposite status
  const newStatus = !currentStatus;

  const url =
    `${API_URL}${ENDPOINTS.UPDATE_MEDICINE_STATUS}${medicineId}/status`;

  const payload = {
    isActive: newStatus
  };

  console.log('Updating medicine status');
  console.log('Medicine ID:', medicineId);
  console.log('Current Status:', currentStatus);
  console.log('New Status:', newStatus);
  console.log('Status API URL:', url);
  console.log('Status Payload:', payload);

  this.isUpdatingMedicineStatus = true;

  this.http.put<any>(url, payload).subscribe({

    next: (res) => {

      console.log(
        'Medicine status updated successfully:',
        res
      );

      // Update UI immediately
      this.selectedMedicine = {
        ...this.selectedMedicine,
        active: newStatus
      };

      this.isUpdatingMedicineStatus = false;
      this.selectedMedicineImage = null;
      this.selectedMedicineImageName = '';

      // Refresh table also
      this.fetchData();
    },

    error: (err) => {

      console.error(
        'Error updating medicine status:',
        err
      );

      this.isUpdatingMedicineStatus = false;
    }

  });
}

openMedicineImage(imageUrl: string, medicineName: string): void {

  if (!imageUrl) {
    return;
  }

  this.selectedMedicineImage = imageUrl;
  this.selectedMedicineImageName = medicineName || 'Medicine Image';

  this.dialog.open(this.medicineImageDialog, {
    width: '600px',
    maxWidth: '95vw',
    maxHeight: '90vh'
  });
}
  openEditMedicine(medicineId: number): void {
    console.log('Medicine ID received for edit:', medicineId);

    // Preserve the ID immediately
    this.selectedMedicineForEdit = {
      medicineId: medicineId
    };

    this.editMedicineForm = {};
    this.isEditMedicineLoading = true;
    this.hasEditChanges = false;

    this.editDialogRef = this.dialog.open(this.editMedicineDialog, {
      width: '950px',
      maxWidth: '95vw',
      maxHeight: '92vh',
      disableClose: true
    });

    const url =
      `${API_URL}${ENDPOINTS.GET_NEW_MEDICINE_DETAILS}${medicineId}`;

    console.log('GET Edit Medicine URL:', url);

    this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('Edit Medicine Details:', res);

        // IMPORTANT: preserve clicked medicine ID
        this.selectedMedicineForEdit = {
          ...res,
          medicineId: medicineId
        };

        this.editMedicineForm = {
          ...res
        };

        this.isEditMedicineLoading = false;
      },
      error: (err) => {
        console.error('Error fetching medicine for edit:', err);
        this.isEditMedicineLoading = false;
        this.editDialogRef?.close();
      }
    });
  }

    openDeleteMedicine(medicineId: number): void {

    console.log('Medicine ID received for delete:', medicineId);

    this.selectedMedicineForDelete = {
      medicineId: medicineId
    };

    this.deleteDialogRef = this.dialog.open(
      this.deleteMedicineDialog,
      {
        width: '450px',
        maxWidth: '95vw',
        disableClose: true
      }
    );
  }

    confirmDeleteMedicine(): void {

    if (
      !this.selectedMedicineForDelete?.medicineId ||
      this.isDeletingMedicine
    ) {
      return;
    }

    const medicineId =
      this.selectedMedicineForDelete.medicineId;

    const url =
      `${API_URL}${ENDPOINTS.DELETE_NEW_MEDICINE_MEDICINE}${medicineId}`;

    console.log('Deleting medicine:', medicineId);
    console.log('Delete Medicine URL:', url);

    this.isDeletingMedicine = true;

    this.http.delete<any>(url).subscribe({

      next: (res) => {

        console.log(
          'Medicine deleted successfully:',
          res
        );

        this.isDeletingMedicine = false;

        // Close delete confirmation popup
        this.deleteDialogRef?.close();

        // Refresh medicine list
        this.fetchData();

        // Close details popup if it is currently open
        this.dialog.closeAll();

        this.selectedMedicineForDelete = null;
      },

      error: (err) => {

        console.error(
          'Error deleting medicine:',
          err
        );

        this.isDeletingMedicine = false;

      }

    });
  }

  cancelDeleteMedicine(): void {
  this.deleteDialogRef?.close();
  this.selectedMedicineForDelete = null;
}
  

    onEditFieldChange(): void {
    this.hasEditChanges = true;
  }

    discardMedicineChanges(): void {

    this.editMedicineForm = {
      ...this.selectedMedicineForEdit
    };

    this.hasEditChanges = false;

    this.editDialogRef?.close();
  }

  saveMedicineChanges(): void {

    if (!this.hasEditChanges || this.isSavingMedicine) {
      return;
    }

    this.isSavingMedicine = true;

    const medicineId =
      this.selectedMedicineForEdit?.medicineId;

    const url =
      `${API_URL}${ENDPOINTS.UPDATE_NEW_MEDICINE_DETAILS}${medicineId}`;

    const payload = {
      name: this.editMedicineForm.name,
      description: this.editMedicineForm.description,
      price: this.editMedicineForm.price,
      quantityInStock: this.editMedicineForm.quantityInStock,
      category: this.editMedicineForm.category,
      manufacturer: this.editMedicineForm.manufacturer,
      expiryDate: this.editMedicineForm.expiryDate,
      genderRestriction: this.editMedicineForm.genderRestriction,
      minAge: this.editMedicineForm.minAge,
      maxAge: this.editMedicineForm.maxAge,
      uses: this.editMedicineForm.uses,
      precautions: this.editMedicineForm.precautions,
      sideEffects: this.editMedicineForm.sideEffects,
      brandName: this.editMedicineForm.brandName,
      dosage: this.editMedicineForm.dosage,
      showInApp: this.editMedicineForm.showInApp,
      prescription_required:
        this.editMedicineForm.prescription_required,
      product_form: this.editMedicineForm.product_form,
      how_to_use: this.editMedicineForm.how_to_use,
      safety_advise: this.editMedicineForm.safety_advise,
      common_side_effec:
        this.editMedicineForm.common_side_effec,
      pregnancy_interaction:
        this.editMedicineForm.pregnancy_interaction,
      how_it_works:
        this.editMedicineForm.how_it_works,
      storage: this.editMedicineForm.storage,
      medicine_type:
        this.editMedicineForm.medicine_type,
      salt_composition:
        this.editMedicineForm.salt_composition
    };

    console.log('Updating medicine:', medicineId);
    console.log('PUT Payload:', payload);

    this.http.put<any>(url, payload).subscribe({

      next: (res) => {

        console.log(
          'Medicine updated successfully:',
          res
        );

        this.isSavingMedicine = false;
        this.hasEditChanges = false;

        // Refresh table
        this.fetchData();

        // Close edit popup
        this.editDialogRef?.close();

        // Optional:
        // refresh the details popup if you want it updated immediately
        this.selectedMedicine = {
          ...this.selectedMedicine,
          ...this.editMedicineForm
        };
      },

      error: (err) => {

        console.error(
          'Error updating medicine:',
          err
        );

        this.isSavingMedicine = false;

      }

    });
  }
}