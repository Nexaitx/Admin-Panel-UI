import { ChangeDetectionStrategy, Component, inject, Input, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FirebaseService } from '../../../service/firebase.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-staff-individual',
  providers: [DatePipe, provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatTooltipModule,
    MatSelectModule,
    FormsModule,
    MatTimepickerModule,
    MatSnackBarModule
  ],
  templateUrl: './staff-individual.html',
  styleUrl: './staff-individual.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffIndividual implements OnInit, OnDestroy, AfterViewInit {
  title = 'Staff List';
  http = inject(HttpClient);
  private firebaseService = inject(FirebaseService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
    public lastUpdateTime: Date | null = null;


  staffs: any[] = [];
  isDrawerOpen = false;
  selectedStaff: any = null;
  @Input() staff: any;

  // ✅ Enhanced Subscription for notifications
  private notificationSubscription!: Subscription;
  public newStaffNotification = new BehaviorSubject<any>(null);
  public hasNewStaff = new BehaviorSubject<boolean>(false);

  displayedColumns: string[] = [
    's_no',
    'staffId',
    'name',
    'phoneNumber',
    'email',
    'address',
    'city',
    'gender',
    'experience',
    'category',
    'subcategory',
    'dutyTimeStart',
    'dutyTimeEnd',
    'shiftType',
    'price',
    'rating',
    'verified',
    'actions'
  ];

  dataSource: MatTableDataSource<any>;
  
  cities: any[] = [
    { value: '', viewValue: 'All Cities' },
    { value: 'chandigarh', viewValue: 'Chandigarh' },
    { value: 'delhi', viewValue: 'Delhi' },
    { value: 'jaipur', viewValue: 'Jaipur' },
    { value: 'other', viewValue: 'Other' }
  ];
  
  subcategories = [
    { value: '', viewValue: 'All Subcategories' },
    { value: 'Pediatric', viewValue: 'Pediatric' },
    { value: 'Geriatric', viewValue: 'Geriatric' }
  ];

  experiences = [
    { value: '', viewValue: 'All Experience' },
    { value: '1-3 years', viewValue: '1-3 years' },
    { value: '3-5 years', viewValue: '3-5 years' }
  ];

  shiftTypes = [
    { value: '', viewValue: 'All Shifts' },
    { value: 'Day', viewValue: 'Day Shift' },
    { value: 'Night', viewValue: 'Night Shift' }
  ];

  dutyTimes = [
    { value: '', viewValue: 'All Times' },
    { value: '9-5', viewValue: '9:00 AM - 5:00 PM' },
    { value: '6-2', viewValue: '6:00 PM - 2:00 AM' }
  ];

  globalFilterValue: string = '';
  selectedCity: string = '';
  selectedSubcategory: string = '';
  selectedExperience: string = '';
  selectedShiftType: string = '';
  selectedDutyTime: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.dataSource = new MatTableDataSource<any>([]);
  }

   ngOnInit() {
    console.log('🔄 StaffIndividual Component Initializing...');
    this.getStaffs();
    this.setupNotificationListener();
    this.setupRealTimeStaffUpdates();
    
    this.dataSource.filterPredicate = this.createFilter();
    this.checkFCMStatus();
  }

    private updateLastUpdateTime(): void {
    this.lastUpdateTime = new Date();
  }
   private setupRealTimeStaffUpdates(): void {
    console.log('🔗 Setting up real-time staff updates...');
    
    this.firebaseService.onStaffUpdate((data) => {
      console.log('🔄 Real-time staff update received:', data);
      this.handleRealTimeStaffUpdate(data);
    });
  }
  //  private handleRealTimeStaffUpdate(updateData: any): void {
  //   const updateType = updateData.type || updateData.action;
  //   const staffId = updateData.staffId;
    
  //   console.log(`🔄 Processing ${updateType} for staff ${staffId}`);

  //   switch (updateType) {
  //     case 'STAFF_CREATED':
  //       this.handleRealTimeStaffCreation(updateData);
  //       break;
  //     case 'STAFF_UPDATED':
  //       this.handleRealTimeStaffUpdate(updateData);
  //       break;
  //     case 'STAFF_DELETED':
  //       this.handleRealTimeStaffDeletion(staffId);
  //       break;
  //     default:
  //       console.log('Unknown update type:', updateType);
  //       break;
  //   }
  // }

  // ✅ NEW: Real-time staff creation
  private handleRealTimeStaffCreation(staffData: any): void {
    console.log('🎉 Real-time staff creation:', staffData);
    
    // Create new staff object
    const newStaff = this.createStaffFromNotification(staffData);
    
    //  if staff already exists
    const existingIndex = this.staffs.findIndex(staff => 
      staff.staffId == newStaff.staffId || 
      staff.phoneNumber === newStaff.phoneNumber
    );

    if (existingIndex === -1) {
      // Add to beginning of array (newest first)
      this.staffs.unshift(newStaff);
      this.updateDataSource();
      
      console.log('✅ New staff added in real-time:', newStaff.name);
      
      // Show notification
      this.showRealTimeUpdateNotification('New Staff Added', `${newStaff.name} has been added`);
      
      // Auto-open details if needed
      if (this.shouldAutoOpenNewStaff()) {
        setTimeout(() => this.openStaffDrawer(newStaff), 1000);
      }
    } else {
      console.log('ℹ️ Staff already exists, updating...');
      this.staffs[existingIndex] = { ...this.staffs[existingIndex], ...newStaff };
      this.updateDataSource();
      this.showRealTimeUpdateNotification('Staff Updated', `${newStaff.name} has been updated`);
    }
  }

  //: Real-time staff update
  private handleRealTimeStaffUpdate(updateData: any): void {
    const staffId = updateData.staffId;
    const staffIndex = this.staffs.findIndex(staff => staff.staffId == staffId);
    
    if (staffIndex > -1) {
      // Update existing staff
      const updatedStaff = this.createStaffFromNotification(updateData);
      this.staffs[staffIndex] = { ...this.staffs[staffIndex], ...updatedStaff };
      this.updateDataSource();
      
      console.log('✅ Staff updated in real-time:', updatedStaff.name);
      this.showRealTimeUpdateNotification('Staff Updated', `${updatedStaff.name} has been updated`);
      
      // If this staff is currently selected in drawer, update it
      if (this.selectedStaff && this.selectedStaff.staffId == staffId) {
        this.selectedStaff = this.staffs[staffIndex];
      }
    } else {
      console.log('ℹ️ Staff not found in local list, adding...');
      this.handleRealTimeStaffCreation(updateData);
    }
  }

  //: Real-time staff deletion
  private handleRealTimeStaffDeletion(staffId: string): void {
    const staffIndex = this.staffs.findIndex(staff => staff.staffId == staffId);
    
    if (staffIndex > -1) {
      const staffName = this.staffs[staffIndex].name;
      
      // Remove from array
      this.staffs.splice(staffIndex, 1);
      this.updateDataSource();
      
      console.log('🗑️ Staff removed in real-time:', staffName);
      this.showRealTimeUpdateNotification('Staff Removed', `${staffName} has been removed`);
      
      // Close drawer if deleted staff is currently open
      if (this.selectedStaff && this.selectedStaff.staffId == staffId) {
        this.closeStaffDrawer();
      }
    }
  }

  //  Update data source efficiently
  private updateDataSource(): void {
    // Create new array reference to trigger change detection
    this.dataSource.data = [...this.staffs];
    
    // Maintain current pagination and sorting
    if (this.dataSource.paginator) {
      this.dataSource.paginator.length = this.staffs.length;
    }
    
    // Re-apply current filter
    this.applyFilter();
  }

  // Show real-time update notifications
  private showRealTimeUpdateNotification(title: string, message: string): void {
    this.snackBar.open(`🔄 ${title}: ${message}`, 'Close', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
  }

  //  Check if should auto-open new staff
  private shouldAutoOpenNewStaff(): boolean {
    // You can add logic here based on your requirements
    // For example: only auto-open if no staff is currently selected
    return !this.selectedStaff && !this.isDrawerOpen;
  }

  // ✅ IMPROVED: Notification listener setup
  private setupNotificationListener(): void {
    console.log('👂 Setting up notification listener...');
    
    this.notificationSubscription = this.firebaseService.getCurrentMessage().subscribe({
      next: (payload) => {
        console.log('📨 Raw notification payload:', payload);
        
        if (payload && payload.data) {
          this.handleNotificationPayload(payload);
        } else if (payload && payload.notification) {
          this.handleDirectNotification(payload);
        }
      },
      error: (error) => {
        console.error('❌ Error in notification listener:', error);
      }
    });
  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (this.sort) {
      this.sort.sort({ id: 'staffId', start: 'desc', disableClear: true });
    }
  }

  ngOnDestroy() {
    // ✅ Cleanup subscriptions
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    console.log('🧹 StaffIndividual Component Destroyed');
  }

  //Enhanced FCM Status Check
  private checkFCMStatus(): void {
    const status = this.firebaseService.getFCMStatus();
    console.log('🔍 FCM Status:', status);
    
    if (!status.isInitialized) {
      console.warn('❌ FCM not initialized properly');
      this.snackBar.open('FCM not initialized. Check console for details.', 'Close', {
        duration: 5000,
        panelClass: ['warn-snackbar']
      });
    }
  }

  // // ✅ Enhanced notification listener setup
  // private setupNotificationListener(): void {
  //   console.log('👂 Setting up notification listener...');
    
  //   this.notificationSubscription = this.firebaseService.getCurrentMessage().subscribe({
  //     next: (payload) => {
  //       console.log('📨 Raw notification payload:', payload);
        
  //       if (payload && payload.data) {
  //         this.handleNotificationPayload(payload);
  //       } else if (payload && payload.notification) {
  //         // Handle direct notification without data
  //         this.handleDirectNotification(payload);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('❌ Error in notification listener:', error);
  //     },
  //     complete: () => {
  //       console.log('🔚 Notification listener completed');
  //     }
  //   });
  // }

  // ✅ Handle different types of notification payloads
  private handleNotificationPayload(payload: any): void {
    const data = payload.data;
    const notificationType = data.type || data.action || 'GENERAL';

    console.log(`🔔 Notification Type: ${notificationType}`, data);

    switch (notificationType) {
      case 'STAFF_CREATED':
        this.handleNewStaffNotification(data);
        break;
      case 'STAFF_UPDATED':
        this.handleStaffUpdatedNotification(data);
        break;
      case 'STAFF_DELETED':
        this.handleStaffDeletedNotification(data);
        break;
      default:
        this.handleGeneralNotification(payload);
        break;
    }
  }

  private handleNewStaffNotification(data: any): void {
    console.log('🎉 🎉 🎉 NEW STAFF NOTIFICATION RECEIVED:', data);
    
    // ✅ IMMEDIATELY ADD NEW STAFF TO THE LIST
    this.addNewStaffToTable(data);
    
    // Show success message
    this.snackBar.open('🎉 New staff notification received!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });

    // Show multiple types of notifications
    this.showSnackbarNotification(data);
    this.showBrowserNotification(data);
    
    // Update UI state
    this.hasNewStaff.next(true);
    
    // Store notification for later use
    this.newStaffNotification.next(data);
  }

  // ✅ NEW METHOD: Add staff directly to table without refresh
  private addNewStaffToTable(notificationData: any): void {
    console.log('🔄 Adding new staff directly to table...');
    
    // Create a new staff object from notification data
    const newStaff = this.createStaffFromNotification(notificationData);
    
    // Check if staff already exists to avoid duplicates
    const existingStaffIndex = this.staffs.findIndex(staff => 
      staff.staffId == newStaff.staffId || 
      (staff.phoneNumber && staff.phoneNumber === newStaff.phoneNumber)
    );

    if (existingStaffIndex === -1) {
      // Add new staff to the beginning of the array
      this.staffs.unshift(newStaff);
      
      // Update the data source
      this.mapAndSetDataSource(this.staffs);
      
      console.log('✅ New staff added to table:', newStaff.name);
      
      // Auto-open the staff details
      setTimeout(() => {
        this.openStaffDrawer(newStaff);
      }, 500);
    } else {
      console.log('ℹ️ Staff already exists in list, updating...');
      // Update existing staff
      this.staffs[existingStaffIndex] = { ...this.staffs[existingStaffIndex], ...newStaff };
      this.mapAndSetDataSource(this.staffs);
    }
  }

  // ✅ NEW METHOD: Create staff object from notification data
  private createStaffFromNotification(data: any): any {
    const staffId = data.staffId || this.generateTemporaryId();
    
    return {
      staffId: staffId,
      name: data.staffName || 'New Staff',
      phoneNumber: data.staffPhone || '',
      email: data.staffEmail || '',
      address: data.address || '',
      city: data.city || '',
      gender: data.gender || '',
      experience: data.experience || '0 years',
      category: data.category || 'General',
      subcategory: data.subcategory || '',
      dutyTimeStart: data.dutyTimeStart || '',
      dutyTimeEnd: data.dutyTimeEnd || '',
      shiftType: data.shiftType || 'General',
      price: data.price || '',
      rating: data.rating || null,
      verified: data.verified || false,
      profession: data.profession || '',
      role: data.staffRole || 'Staff',
      // Include original staff data if available
      originalStaff: {
        degreeUrl: data.degreeUrl || '',
        adharUrl: data.adharUrl || '',
        panUrl: data.panUrl || '',
        medicalLicenseUrl: data.medicalLicenseUrl || '',
        policeVerificationUrl: data.policeVerificationUrl || ''
      },
      // Mark as from notification for tracking
      _fromNotification: true,
      _notificationTime: new Date()
    };
  }

  // ✅ NEW METHOD: Generate temporary ID for staff from notification
  private generateTemporaryId(): number {
    return Math.floor(Math.random() * 1000000) + 100000;
  }

  // ✅ Staff updated notification
  private handleStaffUpdatedNotification(data: any): void {
    const message = `Staff ${data.staffName} has been updated`;
    this.snackBar.open(message, 'Refresh', {
      duration: 5000,
      panelClass: ['info-snackbar']
    }).onAction().subscribe(() => {
      this.refreshStaffList();
    });
  }

  // ✅ Staff deleted notification
  private handleStaffDeletedNotification(data: any): void {
    const message = `Staff ${data.staffName} has been removed`;
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      panelClass: ['warn-snackbar']
    });
    
    // Remove staff from local list
    this.removeStaffFromTable(data.staffId);
  }

  // ✅ NEW METHOD: Remove staff from table
  private removeStaffFromTable(staffId: string): void {
    const staffIndex = this.staffs.findIndex(staff => staff.staffId == staffId);
    if (staffIndex > -1) {
      this.staffs.splice(staffIndex, 1);
      this.mapAndSetDataSource(this.staffs);
      console.log('🗑️ Staff removed from table:', staffId);
    }
  }

  // ✅ General notification handler
  private handleGeneralNotification(payload: any): void {
    const title = payload.notification?.title || 'Notification';
    const body = payload.notification?.body || 'You have a new message';
    
    this.snackBar.open(`${title}: ${body}`, 'Close', {
      duration: 5000,
      panelClass: ['general-snackbar']
    });
  }

  // ✅ Handle direct notification (without data)
  private handleDirectNotification(payload: any): void {
    const notification = payload.notification;
    console.log('📢 Direct notification:', notification);
    
    this.snackBar.open(`${notification.title}: ${notification.body}`, 'Close', {
      duration: 5000
    });
  }

  // ✅ Enhanced snackbar notification with better UX
  private showSnackbarNotification(data: any): void {
    const staffName = data.staffName || 'New Staff';
    const staffRole = data.staffRole || 'Staff';
    const message = `🎉 ${staffName} has been added as ${staffRole}`;
    
    const snackBarRef = this.snackBar.open(message, 'VIEW DETAILS', {
      duration: 8000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar', 'staff-creation-snackbar']
    });

    snackBarRef.onAction().subscribe(() => {
      console.log('👁️ View staff details action clicked');
      this.openNewStaffDetails(data.staffId);
    });

    snackBarRef.afterDismissed().subscribe(() => {
      console.log('📪 Snackbar dismissed');
      this.hasNewStaff.next(false);
    });
  }

  // ✅ Enhanced browser notification
  private showBrowserNotification(data: any): void {
    if (!('Notification' in window)) {
      console.warn('❌ Browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      const staffName = data.staffName || 'New Staff';
      const staffRole = data.staffRole || 'Staff';
      
      const notification = new Notification('🎉 New Staff Created', {
        body: `${staffName} - ${staffRole}`,
        icon: '/assets/icons/staff-icon.png',
        badge: '/assets/icons/badge-72x72.png',
        tag: 'staff-creation',
        data: data,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        this.openNewStaffDetails(data.staffId);
      };

      notification.onclose = () => {
        console.log('🔔 Browser notification closed');
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

    } else if (Notification.permission === 'default') {
      console.log('ℹ️ Notification permission not yet granted');
    } else {
      console.warn('❌ Notification permission denied');
    }
  }

  // ✅ Enhanced staff details opening with retry mechanism
  private openNewStaffDetails(staffId: string): void {
    console.log(`🔍 Attempting to open staff details for ID: ${staffId}`);
    
    // Convert staffId to number if needed
    const numericStaffId = Number(staffId);
    
    // First try to find in current list
    let newStaff = this.staffs.find(staff => staff.staffId === numericStaffId || staff.staffId == staffId);
    
    if (newStaff) {
      console.log('✅ Staff found in current list, opening drawer...');
      this.openStaffDrawer(newStaff);
    } else {
      console.log('🔄 Staff not found in current list, refreshing...');
      this.refreshStaffList();
      
      // Retry mechanism with multiple attempts
      this.retryOpenStaffDetails(staffId, 3);
    }
  }

  // ✅ Retry mechanism for opening staff details
  private retryOpenStaffDetails(staffId: string, maxAttempts: number): void {
    let attempts = 0;
    
    const tryFindStaff = () => {
      attempts++;
      const foundStaff = this.staffs.find(staff => staff.staffId == staffId);
      
      if (foundStaff) {
        console.log(`✅ Staff found after ${attempts} attempt(s)`);
        this.openStaffDrawer(foundStaff);
      } else if (attempts < maxAttempts) {
        console.log(`🔄 Retry ${attempts}/${maxAttempts} for staff ID: ${staffId}`);
        setTimeout(tryFindStaff, 1000);
      } else {
        console.warn(`❌ Staff with ID ${staffId} not found after ${maxAttempts} attempts`);
        this.snackBar.open('Staff details not available yet. Please try again later.', 'Close', { 
          duration: 5000,
          panelClass: ['warn-snackbar']
        });
      }
    };
    
    setTimeout(tryFindStaff, 1000);
  }

  // ✅ Enhanced staff list refresh with loading state
  private refreshStaffListWithDelay(): void {
    console.log('🔄 Refreshing staff list in 1 second...');
    
    // Small delay to ensure backend has processed the creation
    setTimeout(() => {
      this.refreshStaffList();
    }, 1000);
  }

  // ✅ Manual refresh for testing
  public manualCheckForNewStaff(): void {
    console.log('🔄 Manual refresh triggered by user');
    this.snackBar.open('Checking for new staff...', '', { 
      duration: 2000,
      panelClass: ['info-snackbar']
    });
    this.getStaffs();
  }

  // ✅ Request notification permission manually
  public requestNotificationPermission(): void {
    this.firebaseService.requestPermission().then(success => {
      if (success) {
        this.snackBar.open('Notification permission granted!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      } else {
        this.snackBar.open('Please allow notifications in browser settings', 'Close', {
          duration: 5000,
          panelClass: ['warn-snackbar']
        });
      }
    });
  }

  // ✅ Get FCM token status
  public getFCMTokenStatus(): void {
    const token = this.firebaseService.fcmToken;
    if (token) {
      this.snackBar.open('FCM Token is available', 'Close', { duration: 3000 });
      console.log('🔑 FCM Token:', token);
    } else {
      this.snackBar.open('FCM Token not available', 'Close', { duration: 3000 });
    }
  }

  // ✅ Check FCM token in database
  checkFCMTokenInDatabase(): void {
    this.http.get(`${environment.apiUrl}/check-fcm-token`).subscribe({
      next: (response: any) => {
        console.log('🔍 FCM Token in Database:', response);
        this.snackBar.open('FCM Token check completed', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('❌ Error checking FCM token:', error);
      }
    });
  }

  // ✅ NEW METHOD: Test notification system
  public testNotificationSystem(): void {
    console.log('🧪 Testing notification system...');
    
    // Simulate a new staff notification
    const testData = {
      type: 'STAFF_CREATED',
      staffId: '999999',
      staffName: 'Test Staff',
      staffRole: 'Test Role',
      staffEmail: 'test@example.com',
      staffPhone: '1234567890',
      category: 'Test Category',
      subcategory: 'Test Subcategory',
      experience: '2 years',
      shiftType: 'Day Shift'
    };

    this.handleNewStaffNotification(testData);
    
    this.snackBar.open('Test notification sent!', 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }

  // Existing methods with minor improvements
  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      const globalMatch = !searchTerms.globalFilterValue ||
        data.name.toLowerCase().includes(searchTerms.globalFilterValue) ||
        data.staffId.toString().includes(searchTerms.globalFilterValue) ||
        (data.email && data.email.toLowerCase().includes(searchTerms.globalFilterValue));

      const cityMatch = !searchTerms.selectedCity || data.city === searchTerms.selectedCity;
      const subcategoryMatch = !searchTerms.selectedSubcategory || data.subcategory === searchTerms.selectedSubcategory;
      const experienceMatch = !searchTerms.selectedExperience || data.experience === searchTerms.selectedExperience;
      const shiftTypeMatch = !searchTerms.selectedShiftType || data.shiftType === searchTerms.selectedShiftType;
      const dutyTimeMatch = !searchTerms.selectedDutyTime || data.dutyTime === searchTerms.selectedDutyTime;

      return globalMatch && cityMatch && subcategoryMatch && experienceMatch && shiftTypeMatch && dutyTimeMatch;
    };
  }

  applyGlobalFilter(event: Event) {
    this.globalFilterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilter();
  }

  applyFilter() {
    const filterObject = {
      globalFilterValue: this.globalFilterValue,
      selectedCity: this.selectedCity,
      selectedSubcategory: this.selectedSubcategory,
      selectedExperience: this.selectedExperience,
      selectedShiftType: this.selectedShiftType,
      selectedDutyTime: this.selectedDutyTime
    };

    this.dataSource.filter = JSON.stringify(filterObject);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editElement(element: any) {
    console.log(`Edit ${element.name} (ID: ${element.staffId})`);
    // Implement edit functionality
  }

  openStaffDrawer(element: any) {
    this.selectedStaff = element;
    console.log('Selected Staff:', this.selectedStaff);
    this.isDrawerOpen = true;
  }

  closeStaffDrawer() {
    this.isDrawerOpen = false;
    this.selectedStaff = null;
  }

  deleteElement(element: any) {
    console.log(`Delete ${element.name} (ID: ${element.staffId})`);
    // Implement delete functionality
  }

  getStaffs() {
    console.log('📡 Fetching staff list...');
    this.http.get(API_URL + ENDPOINTS.GET_STAFFS).subscribe({
      next: (res: any) => {
        console.log(`✅ Successfully fetched ${res.length} staff members`);
        this.staffs = res;
        this.mapAndSetDataSource(this.staffs);
      },
      error: (err) => {
        console.error('❌ Error fetching staffs:', err);
        this.snackBar.open('Error loading staff data', 'Retry', {
          duration: 5000
        }).onAction().subscribe(() => {
          this.getStaffs();
        });
      }
    });
  }

  refreshStaffList(): void {
    console.log('🔄 Refreshing staff list...');
    this.getStaffs();
  }

  mapAndSetDataSource(staffs: any[]): void {
    const mappedStaffs: any[] = staffs.map(staff => ({
      staffId: staff.staffId,
      name: staff.name,
      category: staff.category,
      experience: staff.experience,
      price: staff.price,
      gender: staff.gender,
      shiftType: staff.shiftType,
      profession: staff.profession,
      email: staff.email,
      phoneNumber: staff.phoneNumber,
      rating: staff.rating,
      verified: staff.verified,
      address: staff.address || '',
      city: staff.city || '',
      subcategory: staff.subcategory || '',
      dutyTimeStart: staff.dutyTimeStart || '',
      dutyTimeEnd: staff.dutyTimeEnd || '',
      originalStaff: staff.originalStaff || staff
    }));

    this.dataSource.data = mappedStaffs;

    // Sort by staffId descending to show newest first
    this.dataSource.data.sort((a, b) => b.staffId - a.staffId);

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  refreshData() {
    this.getStaffs();
  }
}