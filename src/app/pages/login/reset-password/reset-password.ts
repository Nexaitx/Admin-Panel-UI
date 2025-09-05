import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  resetPasswordForm: FormGroup;
  public fb = inject(FormBuilder);
  http = inject(HttpClient);
  private _snackBar = inject(MatSnackBar);
  @Output() changeAuthUI = new EventEmitter<'login' | 'signup' | 'reset-password'>();

  constructor() {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onResetPasswordSubmit() {
    if (this.resetPasswordForm.valid) {
      const email = this.resetPasswordForm.value.email;
      console.log('Reset password requested for:', email);
      this.http.post(`${API_URL}${ENDPOINTS.RESET_PASSWORD}`, { email }).subscribe({
        next: (response: any) => {
          this._snackBar.open(response.message, 'successfully', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        },
        error: (error) => {
           this._snackBar.open('Error sending reset password email', 'Error', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        }
      });
    }
  }

  goToLogin() {
    this.changeAuthUI.emit('login'); // Emit event to return to login
  }
}