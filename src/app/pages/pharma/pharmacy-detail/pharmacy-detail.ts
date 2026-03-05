import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-pharmacy-detail',
  imports: [MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './pharmacy-detail.html',
  styleUrl: './pharmacy-detail.scss',
})
export class PharmacyDetail {
  displayedColumns: string[] = [
    'pharmacyName',
    'address',
    'city',
    'state',
    'pincode',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild('addressDialog') addressDialog!: TemplateRef<any>;
  private dialog = inject(MatDialog);

  form: any = {
    id: 0,
    pharmacyName: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  };

  isEdit = false;

  openDialog(row?: any) {

    if (row) {
      this.form = { ...row };
      this.isEdit = true;
    } else {
      this.clearForm();
      this.isEdit = false;
    }

    this.dialog.open(this.addressDialog, {
      width: '500px'
    });
  }

  saveAddress(dialogRef: any) {

    if (this.isEdit) {

      const index = this.dataSource.data.findIndex(
        a => a.id === this.form.id
      );

      this.dataSource.data[index] = { ...this.form };

      this.dataSource.data = [...this.dataSource.data];

    } else {

      const newAddress = {
        ...this.form,
        id: Date.now()
      };

      this.dataSource.data = [...this.dataSource.data, newAddress];
    }

    dialogRef.close();
  }

  deleteAddress(id: number) {
    this.dataSource.data = this.dataSource.data.filter(a => a.id !== id);
  }

  clearForm() {
    this.form = {
      id: 0,
      pharmacyName: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    };
  }
}
