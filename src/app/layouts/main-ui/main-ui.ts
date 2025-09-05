import { Component } from '@angular/core';
import { Login } from '../../pages/login/login';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Signup } from '../../pages/signup/signup';
import { ResetPassword } from '../../pages/login/reset-password/reset-password';

@Component({
  selector: 'app-main-ui',
  imports: [Login,
    Signup,
    ResetPassword,
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
authUI: 'login' | 'signup' | 'reset-password' = 'signup';

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  setAuthUI(state: 'login' | 'signup' | 'reset-password') {
    this.authUI = state;
  }
}
