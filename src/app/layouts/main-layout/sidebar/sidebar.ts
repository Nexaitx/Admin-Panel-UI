
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuItem, MENU_DATA } from './menu-config';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../../core/const';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatExpansionModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar implements OnInit {

  permissions: string[] = [];

  userProfile = JSON.parse(
    localStorage.getItem('userProfile') || '{}'
  );

  // Support both login response formats:
  // { profile: { role: {...} } }
  // { role: {...} }

  profile = this.userProfile.profile || this.userProfile;

  mainRole = this.profile.role || {};
  subRole = this.profile.subRole || null;

  roleObj = this.subRole || this.mainRole;

  roleName: string =
    this.mainRole.roleType || this.roleObj.roleType || '';

  http = inject(HttpClient);

  filteredMenu: MenuItem[] = [];

  ngOnInit() {
    this.getRolePermissions();
  }

  // Normalize role and permission names
  private normalize(value: string | null | undefined): string {
    return value?.trim().toLowerCase() || '';
  }

  // Check permission and role
  private hasAccess(item: MenuItem): boolean {

    const userRole = this.normalize(this.roleName);

    // Role validation
    if (item.allowedRoles?.length) {

      const roleAllowed = item.allowedRoles.some(
        role => this.normalize(role) === userRole
      );

      if (!roleAllowed) {
        return false;
      }
    }

    // Permission validation
    if (item.permission) {

      const permissionAllowed = this.permissions.some(
        permission =>
          this.normalize(permission) ===
          this.normalize(item.permission)
      );

      if (!permissionAllowed) {
        return false;
      }
    }

    return true;
  }

  getRolePermissions() {

    const roleId =
      this.mainRole.roleid || this.mainRole.roleId;

    const mainPermissions: string[] =
      this.mainRole.permissions || [];

    const subPermissions: string[] =
      this.subRole?.permissions || [];

    // If main role ID exists, fetch latest permissions
    if (roleId) {

      this.http.get<any>(
        `${API_URL}${ENDPOINTS.GET_ROLE_PERMISSIONS_BY_ROLE_ID}${roleId}`
      ).subscribe({

        next: (res: any) => {

          const apiPermissions: string[] =
            res?.permissions || [];

          // Combine main role and sub-role permissions
          this.permissions = [
            ...new Set([
              ...apiPermissions,
              ...mainPermissions,
              ...subPermissions
            ])
          ];

          this.filteredMenu = this.buildMenu(MENU_DATA);

        },

        error: (err) => {

          console.error('Failed to load permissions', err);

          // Fallback to login response permissions
          this.permissions = [
            ...new Set([
              ...mainPermissions,
              ...subPermissions
            ])
          ];

          this.filteredMenu = this.buildMenu(MENU_DATA);
        }

      });

    } else {

      // Sub-role or permissions directly available in login response
      this.permissions = [
        ...new Set([
          ...mainPermissions,
          ...subPermissions,
          ...(this.roleObj?.permissions || [])
        ])
      ];

      this.filteredMenu = this.buildMenu(MENU_DATA);
    }
  }

  // Build filtered sidebar menu
  buildMenu(items: MenuItem[]): MenuItem[] {

    return items

      .filter(item => this.hasAccess(item))

      .map(item => {

        if (item.children?.length) {

          const filteredChildren =
            this.buildMenu(item.children);

          return {
            ...item,
            children: filteredChildren
          };
        }

        return item;

      })

      // Hide empty expansion panels
      .filter(item =>
        item.route ||
        (item.children && item.children.length > 0)
      );
  }

}
