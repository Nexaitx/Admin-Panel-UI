import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../core/services/auth';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    Sidebar,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    CommonModule
  ],
  standalone: true,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  private auth = inject(Auth);
  private router = inject(Router);


  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
