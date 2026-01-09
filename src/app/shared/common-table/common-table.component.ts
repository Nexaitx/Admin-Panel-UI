import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, TemplateRef } from '@angular/core';
import { NgModel } from '@angular/forms';
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
import { MatSelectModule } from '@angular/material/select';

export interface ColumnDef {
  key: string;            // property name in row object
  header: string;         // header label
  sortable?: boolean;     // enable sorting
  editable?: boolean;     // allow editing in dialog
  type?: 'text' | 'number' | 'date' | 'time' | 'select' | 'boolean' | 'password' | 'confirmPassword' | 'action' | 'actionReAssign' | 'actionApproveReject' | 'actionUser' | 'actionStaff'; // data type
  options?: Array<{ value: any, label: string }>; // for select
  width?: string;
}

export interface PaginationEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
  previousPageIndex?: number;
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
    FormsModule,
    MatSelectModule
  ]
})
export class CommonTableComponent implements OnInit, OnChanges {
  @Input() columns: ColumnDef[] = [];
  @Input() data: any[] = [];
  @Input() pageSizeOptions: number[] = [10, 25, 100];
  @Input() showCreate = false;
  @Input() createLabel = 'Create';
  @Input() showActions = true;
  @Input() formFields: ColumnDef[] = [];
  @Input() sortable = true;
  @Input() length: number = 0;
  @Input() serverSidePagination: boolean = true;

  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() create = new EventEmitter<any>();
  @Output() save = new EventEmitter<{ row: any, isNew: boolean }>();
  @Output() pageChange = new EventEmitter<PaginationEvent>();

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('editDialog') editDialog!: TemplateRef<any>;

  editRow: any = null;
  editing = false;
  activeRow: any = null;

  filterValue = '';

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.buildDisplayedColumns();
    this.setData(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.buildDisplayedColumns();
    }
    if (changes['data']) {
      this.setData(changes['data'].currentValue || []);
    }
    if (changes['length'] && this.paginator) {
      this.paginator.length = this.length;
    }
  }

  ngAfterViewInit(): void {
    if (!this.serverSidePagination) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    
    if (this.paginator) {
      this.paginator.length = this.length;
      
      this.paginator.page.subscribe((event: any) => {
        this.pageChange.emit({
          pageIndex: event.pageIndex,
          pageSize: event.pageSize,
          length: this.length,
          previousPageIndex: event.previousPageIndex
        });
      });
    }
  }

  private buildDisplayedColumns() {
    const baseColumns = ['serial', ...this.columns.map(c => c.key)];
    const needsActions = this.showActions && !baseColumns.includes('actions');

    this.displayedColumns = needsActions ? [...baseColumns, 'actions'] : baseColumns;
  }

  private setData(d: any[]) {
    this.dataSource.data = Array.isArray(d) ? d : [];
    
    if (!this.serverSidePagination) {
      if (this.paginator) { this.dataSource.paginator = this.paginator; }
      if (this.sort) { this.dataSource.sort = this.sort; }
    } else {
      if (this.sort) { this.dataSource.sort = this.sort; }
    }
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterValue = value;
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  resetPagination() {
    if (this.paginator) {
      this.paginator.firstPage();
      if (this.serverSidePagination) {
        this.pageChange.emit({
          pageIndex: 0,
          pageSize: this.paginator.pageSize,
          length: this.length,
          previousPageIndex: this.paginator.pageIndex
        });
      }
    }
  }

  setActiveRow(row: any) { this.activeRow = row; }
  clearActiveRow() { this.activeRow = null; }

  handleView() {
    if (this.activeRow) { this.view.emit(this.activeRow); }
  }

  handleEdit() {
    if (this.activeRow) { this.openEditDialog(this.activeRow, false); }
  }

  handleDelete() {
    if (this.activeRow) { this.delete.emit(this.activeRow); }
  }

  onView(row: any, col: ColumnDef) {
    this.view.emit({
      row,
      columnKey: col.key,
      columnType: col.type
    });
  }

  onDelete(row: any) { this.delete.emit(row); }

  private openEditDialog(row: any, isNew: boolean) {
    this.editRow = JSON.parse(JSON.stringify(row));
    this.editing = true;
    this.dialog.open(this.editDialog, { width: '800px', minWidth: '800px', data: { row: this.editRow, isNew } });
  }

  onCreate() {
    this.editRow = {};
    this.editing = true;
    this.dialog.open(this.editDialog, { width: '700px', data: { row: this.editRow, isNew: true } });
  }

  // Called from template-driven controls to validate password match
  checkPasswordMatch(passwordModel: NgModel | null, confirmModel: NgModel | null, row: any) {
    try {
      const pwd = row?.password;
      const cnf = row?.confirmPassword;

      if (!confirmModel || !confirmModel.control) { return; }

      // if both empty, clear errors
      if (!pwd && !cnf) {
        confirmModel.control.setErrors(null);
        return;
      }

      if (pwd !== cnf) {
        const existing = confirmModel.control.errors || {};
        existing['mismatch'] = true;
        confirmModel.control.setErrors(existing);
      } else {
        const existing = confirmModel.control.errors || {};
        if (existing['mismatch']) { delete existing['mismatch']; }
        // if no other errors, clear, else set remaining
        if (Object.keys(existing).length === 0) {
          confirmModel.control.setErrors(null);
        } else {
          confirmModel.control.setErrors(existing);
        }
      }
    } catch (e) {
      // defensive: do nothing on unexpected template states
    }
  }

  saveEdit(row: any, isNew = false) {
    this.save.emit({ row, isNew });
    this.dialog.closeAll();
    this.editing = false;
  }

  cancelEdit() {
    this.dialog.closeAll();
    this.editing = false;
  }
}