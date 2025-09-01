import { Component } from '@angular/core';
import { Login } from '../../pages/login/login';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-ui',
  imports: [Login,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './main-ui.html',
  styleUrl: './main-ui.scss'
})
export class MainUi {
isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
