import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { API_URL, ENDPOINTS } from '../../core/const';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.html',
  styleUrls: ['./permissions.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class Permissions {
  permissionsForm!: FormGroup;
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  roles: any[] = [];
  basePermissionsList: string[] = [
    'Manage', 'Bookings', 'Duty Logs', 'Active Staff', 'GPS Monitoring', 'GPS Deviation',
    'Bulk Assignment', 'Overtime Duties', 'Overtime Approvals', 'Devices & Addresses',
    'Roles', 'Pharma', 'Account', 'Prescriptions', 'Permissions', 'Diet Plans', 'Diet Subscription Plans',
    'Ledgers', 'Diet Bookings', 'Dietician Reports', 'Diet Subscription', 'Settings'
  ];

  constructor() {
    this.permissionsForm = this.fb.group({
      rolePermissions: this.fb.array([])
    });
  }

  ngOnInit() {
    this.getRoles();
  }

  get rolePermissions(): FormArray<FormGroup> {
    return this.permissionsForm.get('rolePermissions') as FormArray<FormGroup>;
  }

  getRoles() {
    this.http.get(API_URL + ENDPOINTS.GET_ROLES).subscribe({
      next: (res: any) => {
        this.roles = res.role;
        this.initializeForm();
        this.getRolePermissions(); // Call after form initialization
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      }
    });
  }

  getRolePermissions() {
    this.http.get(API_URL + ENDPOINTS.GET_ROLE_PERMISSIONS).subscribe({
      next: (res: any) => {
        res.forEach((role: { id: number; roleType: string; permissions: string[] }) => {
          const roleGroup = this.rolePermissions.controls.find(
            group => group.get('roleType')?.value === role.roleType
          );
          if (roleGroup) {
            const permissionsGroup = roleGroup.get('permissions') as FormGroup;
            role.permissions.forEach((perm: string) => {
              if (permissionsGroup.get(perm)) {
                permissionsGroup.get(perm)?.setValue(true);
              } else {
                console.warn(`Permission "${perm}" not found in form for role ID ${role.id}`);
              }
            });
          } else {
            console.warn(`No form group found for role ID ${role.id}`);
          }
        });
        console.log('Role permissions patched:', this.permissionsForm.value);
      },
      error: (err) => {
        console.error('Error fetching role permissions:', err);
      }
    });
  }

  initializeForm() {
    const rolePermissions = this.roles.map(role => {
      const permissionControls = this.basePermissionsList.reduce((acc, perm) => {
        acc[perm] = new FormControl(false);
        return acc;
      }, {} as { [key: string]: FormControl });
      // Add role-specific Dashboard permission
      permissionControls[`${role.roleType} Dashboard`] = new FormControl(false);
      return this.fb.group({
        roleId: [role.id || role.roleId],
        roleType: [role.roleType],
        permissions: this.fb.group(permissionControls)
      });
    });
    this.permissionsForm.setControl('rolePermissions', this.fb.array(rolePermissions));
  }

  savePermissions() {
    const payload = this.rolePermissions.controls.map(group => {
      const roleId = group.get('roleId')?.value;
      const roleType = this.roles.find(r => r.id === roleId || r.roleId === roleId)?.roleType;
      const permissions = Object.keys(group.get('permissions')?.value).filter(
        key => group.get('permissions')?.value[key]
      );
      return { roleId, roleType, permissions };
    });
    this.http.post(API_URL + ENDPOINTS.UPDATE_ROLE_PERMISSIONS, payload).subscribe({
      next: (res: any) => {
        console.log('Permissions updated successfully:', res);
      },
      error: (err) => {
        console.error('Error updating permissions:', err);
      }
    });
  }
}