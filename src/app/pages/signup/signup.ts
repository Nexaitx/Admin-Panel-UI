
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

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  http = inject(HttpClient);
  signupForm!: FormGroup;

  constructor() {
    this.signupForm = this.fb.group({
      name: [''],
      phoneNumber: [''],
      email: [''],
      password: [''],
      confirmPassword: [''],
      roleType: [],
    });
  }

  onSignupSubmit(): void {
    this.signupForm.value.roleType = 'Admin';
    this.http.post(API_URL + ENDPOINTS.SIGNUP, this.signupForm.value).subscribe((res: any) => {
      this.router.navigate(['/login']);
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}