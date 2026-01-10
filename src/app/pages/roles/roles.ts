import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { API_URL, ENDPOINTS } from '../../core/const';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule, MatTreeModule, MatFormFieldModule, MatDialogModule,
    MatInputModule, MatIconModule, MatButtonModule, MatMenuModule,
    MatCardModule, FormsModule, ReactiveFormsModule, MatTooltipModule
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.scss'
})
export class Roles implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @ViewChild('roleDialog') roleDialog!: TemplateRef<any>;
  private dialogRef?: MatDialogRef<any>;

  isEdit = false;
  isSubRoleMode = false;
  selectedRecord: any = null;
  parentRoleId: any = null;
  rolesForm: FormGroup;

  treeControl = new NestedTreeControl<any>(node => node.subRoles);
  dataSource = new MatTreeNestedDataSource<any>();

  constructor() {
    this.rolesForm = this.fb.group({
      roleType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getRoles();
  }

  hasChild = (_: number, node: any) => !!node.subRoles && node.subRoles.length > 0;
  isMainRoleNoChildren = (_: number, node: any) => (!node.subRoles || node.subRoles.length === 0) && node.roleType;

  getRoles() {
    this.http.get(API_URL + ENDPOINTS.GET_ROLES).subscribe({
      next: (res: any) => {
        // 1. Assign data
        this.dataSource.data = res;
        // Ensure tree control knows about the data nodes and expand by default
        try {
          this.treeControl.dataNodes = this.dataSource.data;
          // Expand all nodes so tree is open by default
          this.treeControl.expandAll();
        } catch (e) {
          // ignore if tree control methods are not available
        }
      },
      error: () => this.showSnackBar('Error fetching roles', 'error')
    });
  }
  // Updated to open Dialog instead of Drawer
  openUserDrawer(element?: any) {
    this.isSubRoleMode = false;
    this.isEdit = !!element;
    this.selectedRecord = element || null;
    this.rolesForm.patchValue({ roleType: element ? element.roleType : '' });
    this.openModal();
  }

  openSubRoleDrawer(node: any, isEditMode: boolean) {
    this.isSubRoleMode = true;
    this.isEdit = isEditMode;
    this.selectedRecord = node;
    if (isEditMode) {
      this.rolesForm.patchValue({ roleType: node.subRoleName });
      this.parentRoleId = node.roleId;
    } else {
      this.rolesForm.reset();
      this.parentRoleId = node?.id;
    }
    this.openModal();
  }

  private openModal() {
    this.dialogRef = this.dialog.open(this.roleDialog, {
      width: '500px',
      disableClose: true
    });
  }

  closeDialog() {
    if (this.dialogRef) this.dialogRef.close();
    this.rolesForm.reset();
    this.selectedRecord = null;
    this.parentRoleId = null;
  }

  onSubmission() {
    if (this.rolesForm.invalid) return;

    const val = this.rolesForm.value.roleType;
    let url = '';
    let payload: any = {};

    if (this.isSubRoleMode) {
      url = this.isEdit ? `${API_URL}${ENDPOINTS.UPDATE_SUB_ROLE}${this.selectedRecord.id}` : `${API_URL}${ENDPOINTS.CREATE_SUB_ROLE}`;
      payload = { subRoleName: val, roleId: this.selectedRecord.roleId };
    } else {
      url = this.isEdit ? `${API_URL}${ENDPOINTS.UPDATE_ROLE}${this.selectedRecord.id}` : `${API_URL}${ENDPOINTS.CREATE_ROLE}`;
      payload = { roleType: val };
    }

    const request = this.isEdit ? this.http.put(url, payload) : this.http.post(url, payload);

    request.subscribe({
      next: () => {
        this.showSnackBar(`Role ${this.isEdit ? 'updated' : 'created'} successfully`, 'success');
        this.getRoles();
        this.closeDialog();
      },
      error: () => this.showSnackBar('Operation failed', 'error')
    });
  }

  deleteElement(element: any, isSub: boolean = false) {
    const name = isSub ? element.subRoleName : element.roleType;
    const confirmRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Confirm Deletion', message: `Are you sure you want to delete "${name}"?`,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete'
      }
    });
    confirmRef.afterClosed().subscribe(result => {
      if (result) {
        const url = isSub ? `${API_URL}${ENDPOINTS.DELETE_SUB_ROLE}${element.id}` : `${API_URL}${ENDPOINTS.DELETE_ROLE}${element.id}`;
        this.http.delete(url, { responseType: 'text' }).subscribe({
          next: () => {
            this.getRoles();
            this.showSnackBar('Deleted successfully', 'success');
          },
          error: (err) => {
            this.showSnackBar(err.error?.message || 'Failed to delete role', 'error');
          }
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (!filterValue) return this.getRoles();
    this.dataSource.data = this.dataSource.data.filter(r => r.roleType.toLowerCase().includes(filterValue));
  }

  private showSnackBar(msg: string, type: 'success' | 'error') {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error'] });
  }
}