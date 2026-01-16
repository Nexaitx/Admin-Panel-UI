import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCheckboxModule, MatButtonModule, MatExpansionModule, MatIconModule],
  templateUrl: './permissions.html',
  styleUrls: ['./permissions.scss']
})
export class Permissions implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  snackbar = inject(MatSnackBar);
  permissionsForm: FormGroup = this.fb.group({
    rolePermissions: this.fb.array([])
  });

  basePermissionsList: string[] = [
    'Manage', 'Bookings', 'Booking Payments', 'Duty Assigned', 'Active Staff',
    'GPS Monitoring', 'GPS Deviation', 'Bulk Assignment', 'Override Duties',
    'Cancel Booking', 'Re-Assigned Booking', 'Requested SubCategories',
    'SOS Staff', 'SOS Alerts', 'Devices & Addresses', 'Staff Wallet',
    'Roles', 'Pharma', 'Account', 'Prescriptions', 'Permissions',
    'Diet Plans', 'Diet Subscription Plans', 'Ledgers', 'Diet Bookings',
    'Dietician Reports', 'Diet Subscription', 'Settings'
  ];

  ngOnInit() {
    this.initData();
  }

  get rolePermissionsArray(): FormArray {
    return this.permissionsForm.get('rolePermissions') as FormArray;
  }

  // Casting helpers for template
  getGroup(control: AbstractControl | null): FormGroup {
    return control as FormGroup;
  }

  getPermissionKeys(roleGroup: AbstractControl): string[] {
    const pGroup = (roleGroup as FormGroup).get('permissions') as FormGroup;
    return Object.keys(pGroup.controls);
  }

  initData() {
    // 1. Get Roles Structure
    this.http.get(`${API_URL}${ENDPOINTS.GET_ROLES}`).subscribe({
      next: (roles: any) => {
        this.buildForm(roles);
        // 2. Fetch existing permissions for both types in parallel
        this.fetchAllPermissions();
      },
      error: (err) => console.error('Error fetching roles:', err)
    });
  }

  fetchAllPermissions() {
    forkJoin({
      main: this.http.get(`${API_URL}${ENDPOINTS.GET_ROLE_PERMISSIONS}`),
      sub: this.http.get(`${API_URL}${ENDPOINTS.GET_SUBROLE_PERMISSIONS}`)
    }).subscribe({
      next: (res: any) => {
        if (res.main) this.patchValues(res.main);
        if (res.sub) this.patchValues(res.sub);
      },
      error: (err) => console.error('Error fetching permissions:', err)
    });
  }

  buildForm(roles: any[]) {
    this.rolePermissionsArray.clear();
    roles.forEach(mainRole => {
      this.addRoleToForm(mainRole.id, mainRole.roleType, false);

      if (mainRole.subRoles?.length) {
        mainRole.subRoles.forEach((sub: any) => {
          this.addRoleToForm(sub.id, sub.subRoleName, true);
        });
      }
    });
  }

  private addRoleToForm(id: number, name: string, isSubRole: boolean) {
    const group: any = {};
    // Dynamic Dashboard Key
    group[`${name} Dashboard`] = new FormControl(false);

    this.basePermissionsList.forEach(perm => {
      group[perm] = new FormControl(false);
    });

    this.rolePermissionsArray.push(this.fb.group({
      roleId: [id],
      roleName: [name],
      isSubRole: [isSubRole],
      permissions: this.fb.group(group)
    }));
  }

  patchValues(savedPerms: any[]) {
    if (!Array.isArray(savedPerms)) return;

    savedPerms.forEach(data => {
      const apiId = data.roleId || data.subRoleId;

      const formGroup = this.rolePermissionsArray.controls.find(
        ctrl => ctrl.get('roleId')?.value === apiId
      );

      if (formGroup) {
        const pGroup = formGroup.get('permissions') as FormGroup;
        let permsList: string[] = [];

        if (data.permissions && data.permissions.length > 0) {
          const firstItem = data.permissions[0];

          if (typeof firstItem === 'string') {
            permsList = data.permissions;
          } 
          else if (typeof firstItem === 'object' && firstItem.permissions) {
            permsList = firstItem.permissions;
          }
        }

        permsList.forEach((pName: string) => {
          if (pGroup.get(pName)) {
            pGroup.get(pName)?.patchValue(true);
          }
        });
      }
    });
  }

  saveSingleRole(group: AbstractControl) {
    const formGroup = group as FormGroup;

    const isSubRole = formGroup.get('isSubRole')?.value;
    const id = formGroup.get('roleId')?.value;
    const permissionsObj = formGroup.get('permissions')?.value;
    const activePermissions = Object.keys(permissionsObj).filter(key => permissionsObj[key] === true);

    if (isSubRole) {
      const payload = {
        subRoleId: id,
        permissions: activePermissions
      };

      this.http.post(`${API_URL}${ENDPOINTS.UPDATE_SUBROLE_PERMISSION}`, payload).subscribe({
        next: () => this.snackbar.open('Sub Role Permissions Saved!', 'Close', { duration: 3000 }),
        error: (err) => this.snackbar.open('Sub Role Permissions can not be Saved!', 'Close', { duration: 3000 })
      });

    } else {
      const payload = {
        roleId: id,
        roleType: formGroup.get('roleName')?.value,
        permissions: activePermissions
      };

      this.http.post(`${API_URL}${ENDPOINTS.UPDATE_ROLE_PERMISSIONS}`, [payload]).subscribe({
        next: () => this.snackbar.open('Main Role Permissions Saved!', 'Close', { duration: 3000 }),
        error: (err) => this.snackbar.open('Main Role Permissions can not be Saved!', 'Close', { duration: 3000 })
      });
    }
  }
}