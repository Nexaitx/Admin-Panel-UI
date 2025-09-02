
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  http = inject(HttpClient);
  private _snackBar = inject(MatSnackBar);
  signupForm!: FormGroup;
  roles: any;

  constructor() {
    this.signupForm = this.fb.group({
      name: [''],
      phoneNumber: [''],
      email: [''],
      password: [''],
      confirmPassword: [''],
      roleType: [''],
    });
  }

  ngOnInit() {
    this.http.get(API_URL + ENDPOINTS.GET_ROLES).subscribe((res: any) => {
      this.roles = res.role.filter((r: any) => r.roleType !== 'Admin' && r.roleType !== 'admin');
    });
  }

  onSignupSubmit(): void {
    this.signupForm.value.roleType = 'Admin';
    this.http.post(API_URL + ENDPOINTS.SIGNUP, this.signupForm.value).subscribe((res: any) => {
      if (res) {
        this._snackBar.open('Company Created Successful!', 'Successfully', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.router.navigate(['/login']);
      }
    }, error => {
      //  show snackbar with error message
      this._snackBar.open('Company Already Exists', 'Error', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      console.error('Signup failed:', error.message);
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}