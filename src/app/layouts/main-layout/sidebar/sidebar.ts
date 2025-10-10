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
  userProfile = JSON.parse(localStorage.getItem('permissions') || '{}');
  permissions: string[] = [];

  constructor() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    const permJson = this.userProfile;
    this.permissions = permJson;
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  // hasDashboardForRole(roleType: string): boolean {
  //   console.log(this.hasPermission(`${roleType} Dashboard`));
  //   return this.hasPermission(`${roleType} Dashboard`);
  // }
}