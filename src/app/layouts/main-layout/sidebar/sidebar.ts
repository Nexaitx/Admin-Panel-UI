import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

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
export class Sidebar {
  userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  permissions: string[] = [];
  constructor() {
    console.log(this.userProfile?.role?.roleType);
    this.loadFromStorage();
  }
  loadFromStorage() {
    // const permJson = localStorage.getItem('permissions');
    const permJson = this.userProfile?.role?.permissions;
    console.log(permJson);
    this.permissions = permJson;
  }

  hasPermission(permission: string): boolean {
    // exact match or contains logic
    console.log(permission)
    return this.permissions.includes(permission);
  }

  // optionally, helper for “Dashboard” permission which may be role‑specific
  hasDashboardForRole(roleType: string): boolean {
    return this.hasPermission(`${roleType} Dashboard`);
  }
}