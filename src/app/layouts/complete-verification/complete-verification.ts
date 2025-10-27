import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';


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
    MatDialogModule,
    FormsModule,
    MatCheckboxModule
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

  public dialog = inject(MatDialog);
  termsAcceptedInDialog: any = false;
  @ViewChild('termsDialog') termsDialog!: TemplateRef<any>;

  constructor() {
    this.basicForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required]
    });


    this.documentsForm = this.fb.group({
      licenseFile: [null, Validators.required],
      idProofFile: [null],
    });

    this.addressForm = this.fb.group({
      pharmacyName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      country: ['India', Validators.required],
      termsAccepted: [false, Validators.required]
    });
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (user.active === true) {
      this.router.navigate(['/app/pharmacist-dashboard']);
    }
  }

  openTermsDialog() {
    this.termsAcceptedInDialog = this.addressForm.get('termsAccepted')?.value || false;
    const dialogRef = this.dialog.open(this.termsDialog, {
      width: '600px',
      maxHeight: '80vh',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.addressForm.get('termsAccepted')?.setValue(true);
        this._snackBar.open('Terms and Conditions accepted.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      } else {
        this.addressForm.get('termsAccepted')?.setValue(false);
      }
    });
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
   
    let payload = {
      name: this.basicForm.get('name')?.value,
      phoneNumber: this.basicForm.get('phoneNumber')?.value,
      email: this.basicForm.get('email')?.value,
      pharmacyName: this.addressForm.get('pharmacyName')?.value,
      address1: this.addressForm.get('address1')?.value,
      address2: this.addressForm.get('address2')?.value,
      city: this.addressForm.get('city')?.value,
      state: this.addressForm.get('state')?.value,
      pincode: this.addressForm.get('pincode')?.value,
      country: this.addressForm.get('country')?.value,
      termsAccepted: this.termsAcceptedInDialog,
      licenseFile: this.documentsForm.get('licenseFile')?.value,
      idProofFile: this.documentsForm.get('idProofFile')?.value
    }

    this.submitting = true;
    this.uploadProgress = 0;

    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    this.http.post(API_URL + ENDPOINTS.SUBMIT_KYC_DOCUMENTS, payload, {
      headers,
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
      }
    });
  }


  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }
}
