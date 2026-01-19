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
  
  userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  roleObj = this.userProfile.role || {}; 
  
  roleName: string = this.roleObj.roleType || ''; 

  http = inject(HttpClient);
  filteredMenu: MenuItem[] = [];

  constructor() {}

  ngOnInit() {
    this.getRolePermissions();
    // Do NOT call buildMenu here. It's too early.
  }

  getRolePermissions() {
    if (!this.roleObj?.roleid) {
      console.warn('No Role ID found');
      return;
    }

    this.http.get<any>(`${API_URL}${ENDPOINTS.GET_ROLE_PERMISSIONS_BY_ROLE_ID}${this.roleObj.roleid}`)
      .subscribe({
        next: (res: any) => {
          // 3. Assign permissions from API
          // Ensure we map to a simple string array if the API returns objects
          this.permissions = res.permissions || []; 

          console.log('Permissions loaded:', this.permissions);

          // 4. BUILD MENU HERE (Inside the subscription)
          // Now that we have data, we can filter the menu
          this.filteredMenu = this.buildMenu(MENU_DATA);
        },
        error: (err) => {
          console.error('Failed to load permissions', err);
          // Optional: Show a fallback menu or empty state
          this.filteredMenu = []; 
        }
      });
  }

  buildMenu(items: MenuItem[]): MenuItem[] {
    return items
      .filter(item => {
        // Check 1: Permissions
        // If the item has no permission requirement, allow it.
        // If it does, check if our API permissions include it.
        const hasPerm = item.permission 
          ? this.permissions.includes(item.permission) 
          : true;

        // Check 2: Roles
        // We compare item.allowedRoles against this.roleName (String), not the Object
        const hasRole = item.allowedRoles 
          ? item.allowedRoles.includes(this.roleName) 
          : true;

        return hasPerm && hasRole;
      })
      .map(item => {
        // Recursion for sub-menus
        if (item.children) {
          // We recursively filter children, but we keep the parent 
          // even if it has no children left (or you can filter empty parents out)
          const filteredChildren = this.buildMenu(item.children);
          
          // Optional: If you want to hide the parent if all children are hidden:
          // if (filteredChildren.length === 0) return null; 

          return { ...item, children: filteredChildren };
        }
        return item;
      })
      // Clean up nulls if you implemented the "Optional" step above
      .filter(item => item !== null) as MenuItem[]; 
  }
}