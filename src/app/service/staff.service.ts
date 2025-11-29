// staff.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Staff {
  staffId: number;
  name: string;
  phoneNumber: string;
  email: string;
  category: string;
  subcategory: string;
  experience: string;
  shiftType: string;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private http = inject(HttpClient);
  
  // BehaviorSubject to hold staff data
  private staffsSubject = new BehaviorSubject<Staff[]>([]);
  public staffs$ = this.staffsSubject.asObservable();
  
  // For new staff notifications
  private newStaffSubject = new BehaviorSubject<Staff | null>(null);
  public newStaff$ = this.newStaffSubject.asObservable();

  constructor() {
    this.loadInitialStaff();
  }

  // Load initial staff data
  private loadInitialStaff(): void {
    this.http.get<Staff[]>(`${environment.apiUrl}/api/staffs`).subscribe({
      next: (staffs) => {
        this.staffsSubject.next(staffs);
      },
      error: (error) => {
        console.error('Error loading staff:', error);
      }
    });
  }

  // Add new staff to the list
  addNewStaff(staff: Staff): void {
    const currentStaffs = this.staffsSubject.value;
    
    // Check if staff already exists to avoid duplicates
    const exists = currentStaffs.find(s => s.staffId === staff.staffId);
    if (!exists) {
      const updatedStaffs = [staff, ...currentStaffs]; // Add to beginning
      this.staffsSubject.next(updatedStaffs);
      this.newStaffSubject.next(staff);
      
      console.log('🎉 New staff added to local state:', staff);
    }
  }

  // Refresh staff list from server
  refreshStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${environment.apiUrl}/api/staffs`).pipe(
      tap(staffs => {
        this.staffsSubject.next(staffs);
      })
    );
  }

  // Get current staff list
  getCurrentStaff(): Staff[] {
    return this.staffsSubject.value;
  }
}