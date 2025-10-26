import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-complete-verification',
  imports: [MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './complete-verification.html',
  styleUrl: './complete-verification.scss'
})
export class CompleteVerification {
  private auth = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private _snackBar = inject(MatSnackBar);

  basicForm!: FormGroup;
  documentsForm!: FormGroup;
  addressForm!: FormGroup;


  // files storage
  licenseFile: File | null = null;
  idProofFile: File | null = null;
  licenseName = '';
  idName = '';

  // upload state
  submitting = false;
  uploadProgress: number | null = null;
  // replace with your real endpoint
  private readonly API_UPLOAD_URL = '/api/pharmacist/kyc-verification';

  constructor() {
    this.basicForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required]
    });


    this.documentsForm = this.fb.group({
      drugLicense: [null, Validators.required],
      idProof: [null],
    });

    this.addressForm = this.fb.group({
      pharmacyName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      country: ['India', Validators.required]
    });
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('userProfile') || '{}');
    console.log(user.active)
    if(user.active === true) {
      this.router.navigate(['/app/pharmacist-dashboard']);
    }
  }

  onFileSelected(event: Event, which: 'license' | 'id') {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    // simple client-side validations
    const maxBytes = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (file.size > maxBytes) {
      alert('File too large. Max 5 MB');
      input.value = '';
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      alert('Unsupported file type. Use jpg, png or pdf');
      input.value = '';
      return;
    }
    if (which === 'license') {
      this.licenseFile = file;
      this.licenseName = file.name;
      this.documentsForm.get('license')?.setValue(file);
    } else {
      this.idProofFile = file;
      this.idName = file.name;
      this.documentsForm.get('id')?.setValue(file);
    }
  }
  // enforce that at least license + one id (PAN/Aadhaar) present
  documentsUploaded(): boolean {
    return !!this.licenseFile && !!(this.idProofFile);
    // If you'd like to accept either PAN OR Aadhaar, change above logic to allow either id.
  }

  submit() {
    if (this.addressForm.invalid || !this.licenseFile) {
      alert('Please complete required fields and upload the license.');
      return;
    }
    // Build form data
    const fd = new FormData();
    fd.append('fullName', this.basicForm.get('fullName')?.value);
    fd.append('phone', this.basicForm.get('phone')?.value);
    fd.append('pharmacyName', this.addressForm.get('pharmacyName')?.value);
    fd.append('addressLine1', this.addressForm.get('addressLine1')?.value);
    fd.append('addressLine2', this.addressForm.get('addressLine2')?.value || '');
    fd.append('city', this.addressForm.get('city')?.value);
    fd.append('state', this.addressForm.get('state')?.value);
    fd.append('pincode', this.addressForm.get('pincode')?.value);
    fd.append('country', this.addressForm.get('country')?.value);
    fd.append('licenseFile', this.licenseFile as Blob, (this.licenseFile as File).name);
    if (this.idProofFile) fd.append('idProofFile', this.idProofFile as Blob, (this.idProofFile as File).name);
    this.submitting = true;
    this.uploadProgress = 0;
    this.http.post(API_URL + ENDPOINTS.SUBMIT_KYC_DOCUMENTS, { fd }, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.submitting = false;
          this.uploadProgress = null;
          this._snackBar.open('Documents submitted successfully! Waiting for admin review.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.router.navigate(['/verification-under-process']);
        }
      },
      error: (err: any) => {
        console.error(err);
        this.submitting = false;
        this.uploadProgress = null;
        this._snackBar.open('Upload failed. Please try again later.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.router.navigate(['/verification-under-process']);
      }
    });
  }


  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }
}
