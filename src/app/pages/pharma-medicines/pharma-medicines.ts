import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

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
  ],
  templateUrl: './pharma-medicines.html',
  styleUrl: './pharma-medicines.scss'
})
export class PharmaMedicines {
  selectedMedicineType: string = '';

  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  medicineForm!: FormGroup;
  editing = false;
  editingMedicineId: number | null = null;

  locations = ['State A', 'State B', 'City C', 'City D'];

  medicines: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'location', 'name', 'onApp', 'discount', 'mrp', 'image', 'actions'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.loadMedicines();

    this.dataSource.paginator = this.paginator;
  }

  initForm() {
    this.medicineForm = this.fb.group({
      location: ['', Validators.required],
      name: ['', Validators.required],
      onApp: [false],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      usage: [''],
      sideEffects: [''],
      mrp: [0, Validators.required],
      imageFile: [null]
    });
  }

  loadMedicines() {
    // load existing medicines from API or local array
    // for demo, start empty
    this.dataSource.data = this.medicines;
  }

  openCreate() {
    this.editing = false;
    this.editingMedicineId = null;
    this.medicineForm.reset({
      location: '',
      name: '',
      onApp: false,
      discount: 0,
      usage: '',
      sideEffects: '',
      mrp: 0,
      imageFile: null
    });
    this.drawer.open();
  }

  openEdit(m: any) {
    this.editing = true;
    this.editingMedicineId = m.id ?? null;
    this.medicineForm.patchValue({
      location: m.location,
      name: m.name,
      onApp: m.onApp,
      discount: m.discount,
      usage: m.usage,
      sideEffects: m.sideEffects,
      mrp: m.mrp,
      imageFile: null
    });
    this.drawer.open();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.medicineForm.patchValue({ imageFile: file });
      // Optionally preview, upload etc.
    }
  }

  onSubmit() {
    const form = this.medicineForm.value;
    if (this.editing && this.editingMedicineId != null) {
      // update existing
      const idx = this.medicines.findIndex(m => m.id === this.editingMedicineId);
      if (idx >= 0) {
        const updated: any = {
          id: this.editingMedicineId,
          location: form.location,
          name: form.name,
          onApp: form.onApp,
          discount: form.discount,
          usage: form.usage,
          sideEffects: form.sideEffects,
          mrp: form.mrp,
          // you’d update imageUrl after uploading
        };
        this.medicines[idx] = updated;
      }
    } else {
      // create new
      const newMed: any = {
        id: this.medicines.length + 1, // or server gives id
        location: form.location,
        name: form.name,
        onApp: form.onApp,
        discount: form.discount,
        usage: form.usage,
        sideEffects: form.sideEffects,
        mrp: form.mrp,
      };
      this.medicines.push(newMed);
    }

    this.dataSource.data = this.medicines;
    this.drawer.close();
  }

  deleteMedicine(m: any) {
    this.medicines = this.medicines.filter(x => x.id !== m.id);
    this.dataSource.data = this.medicines;
  }

  onMedicineTypeChange(selectedValue: string) {
    this.selectedMedicineType = selectedValue;
  }

  // createMedicine() {
  //   // Logic to create a new medicine entry
  //   console.log('Creating new medicine entry...');
  // }
}
