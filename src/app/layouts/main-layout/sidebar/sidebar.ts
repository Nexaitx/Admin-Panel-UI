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
  roleObj = this.userProfile.role || this.userProfile.subRole || {};

  roleName: string = this.roleObj.roleType || '';

  http = inject(HttpClient);
  filteredMenu: MenuItem[] = [];

  constructor() { }

  ngOnInit() {
    this.getRolePermissions();
  }

  getRolePermissions() {
    if (!this.roleObj?.roleid && !this.userProfile?.hasSubRole) {
      return;
    }
    if (this.roleObj?.roleid) {
      this.http.get<any>(`${API_URL}${ENDPOINTS.GET_ROLE_PERMISSIONS_BY_ROLE_ID}${this.roleObj.roleid}`)
        .subscribe({
          next: (res: any) => {
            this.permissions = res.permissions || [];
            this.filteredMenu = this.buildMenu(MENU_DATA);
          },
          error: (err) => {
            console.error('Failed to load permissions', err);
            this.filteredMenu = [];
          }
        });
    }
    else if (this.userProfile?.hasSubRole) {
      const existingPerms = this.roleObj?.permissions || [];
      this.permissions = existingPerms.includes('Dashboard')
        ? [...existingPerms]
        : ['Dashboard', ...existingPerms];
      const menu = {
        title: 'Dashboard',
        icon: 'widgets',
        route: '/app/dashboard',
        permission: 'Dashboard'
      }
      const otherMenuItems = this.buildMenu(MENU_DATA);
      this.filteredMenu = [menu, ...otherMenuItems];
    }
  }

  buildMenu(items: MenuItem[]): MenuItem[] {
    return items
      .filter(item => {
        const hasPerm = item.permission
          ? this.permissions.includes(item.permission)
          : true;
        const hasRole = item.allowedRoles
          ? item.allowedRoles.includes(this.roleName)
          : true;
        return hasPerm && hasRole;
      })
      .map(item => {
        if (item.children) {
          const filteredChildren = this.buildMenu(item.children);
          return { ...item, children: filteredChildren };
        }
        return item;
      })
      .filter(item => item !== null) as MenuItem[];
  }
}