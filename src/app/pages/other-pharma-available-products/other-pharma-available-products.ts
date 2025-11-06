import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-other-pharma-available-products',
  imports: [MatIconModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    CommonModule,
    MatButtonModule],
  templateUrl: './other-pharma-available-products.html',
  styleUrl: './other-pharma-available-products.scss',
  providers: [DatePipe]
})
export class OtherPharmaAvailableProducts {
displayedColumns: string[] = ['s_no', 'id', 'name', 'category', 'stockQty', 'price', 'addedDate', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
      const products: any[] = [
       { id: 'P001', name: 'Paracetamol', category: 'Analgesics', stockQty: 150, price: 20.50, addedDate: new Date('2025-11-01') },
       { id: 'P002', name: 'Ibuprofen', category: 'NSAIDs', stockQty: 80, price: 30.00, addedDate: new Date('2025-10-25') },
       { id: 'P003', name: 'Amoxicillin', category: 'Antibiotics', stockQty: 200, price: 45.75, addedDate: new Date('2025-10-30') },
       { id: 'P004', name: 'Cetirizine', category: 'Antihistamines', stockQty: 120, price: 15.00, addedDate: new Date('2025-11-03') },
       { id: 'P005', name: 'Loratadine', category: 'Antihistamines', stockQty: 90, price: 18.25, addedDate: new Date('2025-10-28') },
       { id: 'P006', name: 'Metformin', category: 'Antidiabetics', stockQty: 60, price: 50.00, addedDate: new Date('2025-11-02') },
       { id: 'P007', name: 'Atorvastatin', category: 'Statins', stockQty: 110, price: 70.00, addedDate: new Date('2025-10-27') },
       { id: 'P008', name: 'Omeprazole', category: 'Proton Pump Inhibitors', stockQty: 130, price: 40.00, addedDate: new Date('2025-11-04') },
       { id: 'P009', name: 'Amlodipine', category: 'Calcium Channel Blockers', stockQty: 75, price: 55.50, addedDate: new Date('2025-10-29') },
       { id: 'P010', name: 'Simvastatin', category: 'Statins', stockQty: 95, price: 65.00, addedDate: new Date('2025-11-05') }
      ];

    this.dataSource = new MatTableDataSource(products);
  }

  ngAfterViewInit(): void {
    // 1. Initial sort on 'addedDate' descending
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sort({ id: 'addedDate', start: 'desc', disableClear: true });
    
    // 2. Disable sorting on the 's_no' column
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 's_no') {
        return 0; // Return a constant value or handle as needed
      }
      return item[property];
    };
  }

    applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onView(product: any) {
    // your logic to view details of product
    console.log('Viewing', product);
  }
}
