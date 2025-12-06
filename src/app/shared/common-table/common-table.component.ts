import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ColumnDef {
  key: string;           // property name in row object
  header: string;        // header label
  sortable?: boolean;    // enable sorting
  editable?: boolean;    // allow editing in dialog
  type?: 'text'|'number'|'date'|'select'|'boolean';
  options?: Array<{value:any,label:string}>; // for select
  width?: string;
}

@Component({
  selector: 'app-common-table',
  standalone: true,
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule
  ]
})
export class CommonTableComponent implements OnInit, OnChanges {
  @Input() columns: ColumnDef[] = [];
  @Input() data: any[] = [];
  @Input() pageSizeOptions: number[] = [5,10,25,100];
  @Input() showCreate = false;
  @Input() createLabel = 'Create';

  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() create = new EventEmitter<any>();
  @Output() save = new EventEmitter<{row: any, isNew: boolean}>(); // Added type for clarity

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('editDialog') editDialog!: TemplateRef<any>;

  // local model used in dialog
  editRow: any = null;
  editing = false;
  // Added to handle row actions from the single mat-menu
  activeRow: any = null; 

  filterValue = '';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.buildDisplayedColumns();
    this.setData(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.buildDisplayedColumns();
    }
    // Ensure data is updated whenever the Input property changes
    if (changes['data']) {
      this.setData(changes['data'].currentValue || []);
    }
  }

  // Corrected lifecycle hook for attaching Paginator/Sort
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private buildDisplayedColumns() {
    this.displayedColumns = this.columns.map(c => c.key);
    if (!this.displayedColumns.includes('actions')) {
      this.displayedColumns.push('actions');
    }
  }

  private setData(d: any[]) {
    this.dataSource.data = Array.isArray(d) ? d : [];
    // Re-attach paginator and sort if available (essential for data refresh)
    if (this.paginator) { this.dataSource.paginator = this.paginator; }
    if (this.sort) { this.dataSource.sort = this.sort; }
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterValue = value;
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  // --- Action Menu Management ---
  setActiveRow(row: any) { this.activeRow = row; }
  clearActiveRow() { this.activeRow = null; }

  // Menu click handlers using the activeRow
  handleView() { 
    if (this.activeRow) { this.view.emit(this.activeRow); } 
  }
  
  handleEdit() {
    if (this.activeRow) { this.openEditDialog(this.activeRow, false); }
  }
  
  handleDelete() { 
    if (this.activeRow) { this.delete.emit(this.activeRow); } 
  }

  // Direct methods (could be used for non-menu actions like a separate Edit button)
  onView(row: any) { this.view.emit(row); }
  onDelete(row: any) { this.delete.emit(row); }

  // Centralized function to open the edit dialog
  private openEditDialog(row: any, isNew: boolean) {
    // Deep clone the row for editing so changes aren't reflected in the table before saving
    this.editRow = JSON.parse(JSON.stringify(row));
    this.editing = true;
    this.dialog.open(this.editDialog, { width: '700px', data: { row: this.editRow, isNew } });
  }

  // Open dialog for creation
  onCreate() {
    this.editRow = {};
    this.editing = true;
    this.dialog.open(this.editDialog, { width: '700px', data: { row: this.editRow, isNew: true } });
  }

  // Dialog actions
  saveEdit(row: any, isNew = false) {
    // Emit to the parent component to handle the actual saving/update logic
    this.save.emit({row, isNew}); 
    this.dialog.closeAll();
    this.editing = false;
  }

  cancelEdit() {
    this.dialog.closeAll();
    this.editing = false;
  }
}