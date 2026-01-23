import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Custom validator function to check if passwords match
export const passwordMatchValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  http = inject(HttpClient);
  private _snackBar = inject(MatSnackBar);
  signupForm!: FormGroup;
  roles: any;
  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]*$')]],
        phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
      },
      {
        // Add the custom validator at the form group level
        validators: passwordMatchValidator,
      }
    );
  }

  onKeyPress(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Check if the character is a number (0-9)
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      // If not, prevent the key press
      event.preventDefault();
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  ngOnInit() {
    this.http.get(API_URL + ENDPOINTS.GET_ROLES).subscribe((res: any) => {
      this.roles = res.filter((r: any) => r.roleType !== 'Admin' && r.roleType !== 'admin' && r.roleType !== 'Doctor' && r.roleType !== 'doctor');
    });
  }

  onSignupSubmit(): void {
    // Check if the form is valid before submitting
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this._snackBar.open('Please correct the form errors.', 'Error', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    // this.signupForm.value.roleType = 'Admin';
    this.http.post(API_URL + ENDPOINTS.SIGNUP, this.signupForm.value).subscribe(
      (res: any) => {
        if (res) {
          this._snackBar.open('Company Created Successful!', 'Successfully', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        this._snackBar.open('Company Already Exists', 'Error', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        console.error('Signup failed:', error.message);
      }
    );
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}