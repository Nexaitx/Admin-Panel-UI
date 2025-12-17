import { ChangeDetectionStrategy, Component, inject, Input, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { API_URL, ENDPOINTS } from '../../../core/const';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { pushMessages$ } from '../../../core/services/push-notification';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';


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
    MatDialogModule,
    MatRadioModule
  ],
  templateUrl: './staff-individual.html',
  styleUrl: './staff-individual.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffIndividual implements OnDestroy {
  title = 'Staff List';
  http = inject(HttpClient);
  staffs: any[] = [];
  allStaffs: any[] = [];
  isDrawerOpen = false;
  selectedStaff: any = null;
  @Input() staff: any;
  private _snackBar = inject(MatSnackBar);


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
    'status',
    'actions'
  ];
  isActive: boolean = false;
  verification: boolean = false;
  @ViewChild('verificationDialog') verificationDialog!: TemplateRef<any>;
  @ViewChild('staffStatus') staffStatus!: TemplateRef<any>;
  dialog = inject(MatDialog);

  dataSource: MatTableDataSource<any>;
  states: any;
  subcategories: any;

  experiences = [
    { value: '', viewValue: 'All Experience' },
    // Use numeric values for API compatibility (min experience in years)
    { value: '1', viewValue: '1 year' },
    { value: '2', viewValue: '2 years' },
    { value: '3', viewValue: '3 years' },
    { value: '4', viewValue: '4 years' },
    { value: '5', viewValue: '5+ years' }
  ];

  dutyTimes = [
    { value: '', viewValue: 'All Times' },
    { value: '9-5', viewValue: '9:00 AM - 5:00 PM' },
    { value: '6-2', viewValue: '6:00 PM - 2:00 AM' }
  ];

  globalFilterValue: string = '';
  selectedCity: any;
  selectedSubcategory: any;
  selectedExperience: string = '';
  selectedShiftType: string = '';
  selectedDutyTime: string = '';
  isVerified: boolean = false;
  reason: string = '';
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  private _pushSub: any;

  ngOnInit() {
    this.getStates();
    this.getSubCategories();
    this.getStaffs();
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = `${data.staffId} ${data.name} ${data.category} ${data.experience} ${data.price} ${data.gender} ${data.shiftType} ${data.profession} ${data.email} ${data.phoneNumber} ${data.rating} ${data.verified}`.toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };
    try {
      this._pushSub = pushMessages$.subscribe((msg: any) => {
        const payload = msg && msg.payload ? msg.payload : msg;
        const title = payload?.notification?.title || payload?.data?.title || payload?.title;
        if (title === 'New Staff Registered' || title === 'New Staff Added') {
          this.getStaffs();
        }
      });
    } catch (e) {
      console.warn('Failed to subscribe to push messages', e);
    }
  }

  ngOnDestroy(): void {
    try {
      if (this._pushSub && typeof this._pushSub.unsubscribe === 'function') {
        this._pushSub.unsubscribe();
      }
    } catch (e) { }

    if (this.states && this.states.length) { this.selectedCity = this.states[0]; }
    if (this.subcategories && this.subcategories.length) { this.selectedSubcategory = this.subcategories; }
    if (this.experiences && this.experiences.length) { this.selectedExperience = this.experiences[0].value; }
    if (this.dutyTimes && this.dutyTimes.length) { this.selectedDutyTime = this.dutyTimes[0].value; }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sort({ id: 'addedDate', start: 'desc', disableClear: true });
  }

  updatePrice(element: any) {
    switch (element.selectedShift) {
      case '08:00':
        element.calculatedPrice = element.eightPrice;
        break;
      case '12:00':
        element.calculatedPrice = element.twelveHourPrice;
        break;
      case '24:00':
        element.calculatedPrice = element.twentyFourHourPrice;
        break;
      case '1month8hours':
        element.calculatedPrice = element.monthly8price;
        break;
      case '1month12hours':
        element.calculatedPrice = element.monthly12price;
        break;
      case '1month24hours':
        element.calculatedPrice = element.monthly24price;
        break;
      default:
        element.calculatedPrice = '';
    }
  }

  getSubCategories() {
    this.http.get(API_URL + ENDPOINTS.GET_SUB_CATEGORIES).subscribe({
      next: (res: any) => {
        this.subcategories = res;
      },
      error: (err) => {
        console.error('Error fetching subcategories:', err);
      }
    });
  }

  getStates() {
    this.http.get(API_URL + ENDPOINTS.GET_STATES).subscribe({
      next: (res: any) => {
        this.states = res;
      },
      error: (err) => {
        console.error('Error fetching states:', err);
      }
    });
  }
  private mapDefaultShiftOnData(data: any[]) {
    return data.map(el => ({
      ...el,
      selectedShift: el.category === 'nurse' ? '08:00' : '1month8hours',
      calculatedPrice: el.category === 'nurse' ? el.eightPrice : el.monthly8price
    }));
  }

  getStaffByFilter() {
    let params = new HttpParams();
    console.log(this.selectedDutyTime);
    if (this.selectedCity) {
      params = params.set('state', String(this.selectedCity));
    }
    if (this.selectedSubcategory) {
      params = params.set('subCategory', String(this.selectedSubcategory));
    }
    if (this.selectedExperience && this.selectedExperience.trim() !== '') {
      params = params.set('experience', this.selectedExperience);
    }
    if (this.selectedShiftType && this.selectedShiftType.trim() !== '') {
      params = params.set('shiftType', this.selectedShiftType);
    }
    if (this.selectedDutyTime) {
      const timeDate = new Date(this.selectedDutyTime);

      // Check for valid date to avoid errors
      if (!isNaN(timeDate.getTime())) {
        const formattedTime = timeDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        params = params.set('startTime', formattedTime);
      }
      console.log(params)
      // params = params.set('startTime', this.selectedDutyTime);
    }

    this.http.get(API_URL + ENDPOINTS.GET_STAFF_FILTER, { params }).subscribe({
      next: (res: any) => {
        const reversed = Array.isArray(res) ? [...res].reverse() : res;
        // this.dataSource.data = reversed;
        this.dataSource.data = this.mapDefaultShiftOnData(reversed);
      },
      error: (err) => {
        console.error('Error fetching filtered staffs:', err);
      }
    });
  }

  resetFilters() {
    this.globalFilterValue = '';
    this.selectedCity = null;
    this.selectedSubcategory = null;
    this.selectedExperience = '';
    this.selectedShiftType = '';
    this.selectedDutyTime = '';
    this.getStaffs();
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = (data: any, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      const globalMatch = !searchTerms.globalFilterValue ||
        data.name.toLowerCase().includes(searchTerms.globalFilterValue) ||
        data.staffId.toLowerCase().includes(searchTerms.globalFilterValue) ||
        data.email.toLowerCase().includes(searchTerms.globalFilterValue);

      const cityMatch = !searchTerms.selectedCity || data.city === searchTerms.selectedCity;
      const subcategoryMatch = !searchTerms.selectedSubcategory || data.subCategory === searchTerms.selectedSubcategory;
      const experienceMatch = !searchTerms.selectedExperience || data.experience === searchTerms.selectedExperience;
      const shiftTypeMatch = !searchTerms.selectedShiftType || data.shiftType === searchTerms.selectedShiftType;
      const dutyTimeMatch = !searchTerms.selectedDutyTime || data.dutyTime === searchTerms.selectedDutyTime;

      return globalMatch && cityMatch && subcategoryMatch && experienceMatch && shiftTypeMatch && dutyTimeMatch;
    }
    return filterFunction;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.getStaffs();
    }
  }

  editElement(element: any) {
    console.log(`Edit ${element.name} (ID: ${element.staffId})`);
    alert(`Editing: ${element.name} (Staff ID: ${element.staffId})`);
  }

  openStaffDrawer(element: any) {
    this.selectedStaff = element;
    this.isDrawerOpen = true;
  }

  closeStaffDrawer() {
    this.isDrawerOpen = false;
  }

  deleteElement(element: any) {
    console.log(`Delete ${element.name} (ID: ${element.staffId})`);
    alert(`Deleting: ${element.name} (Staff ID: ${element.staffId})`);
  }

  getStaffs() {
    this.http.get(API_URL + ENDPOINTS.GET_STAFFS).subscribe({
      next: (res: any) => {
        const reversed = Array.isArray(res) ? [...res].reverse() : res;
        this.allStaffs = reversed; // Store reversed data
        // this.dataSource.data = reversed;
        this.dataSource.data = this.mapDefaultShiftOnData(reversed);
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        console.error('Error fetching staffs:', err);
      }
    });
  }

  refreshData() {
    this.ngOnInit();
  }

  openStaffDisableDialog(m: any) {
    const dialogRef = this.dialog.open(this.staffStatus, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  disableStaff() {
    const payload = {
      staffIds: [this.selectedStaff.staffId],
      isActive: this.isActive
    }
    this.http.post(API_URL + ENDPOINTS.DISABLE_STAFF, payload).subscribe((res: any) => {
      this.getStaffs();
      if (this.isActive) {
        this._snackBar.open('Staff Active Successfully', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      } else {
        this._snackBar.open('Staff In-Active Successfully', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      }
    },
      (err: any) => {
        this._snackBar.open('Error in Staff Active/In-Active', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      });
  }

  openVerificationDialog(m: any) {
    this.isVerified = this.selectedStaff.verified;
    const dialogRef = this.dialog.open(this.verificationDialog, {
      width: '850px',
      minWidth: '850px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  verifyStaffDocuments() {
    const payload = {
      staffIds: [this.selectedStaff?.staffId],
      isVerified: this.isVerified,
      reason: this.reason
    }
    this.http.post(API_URL + ENDPOINTS.VERIFY_STAFF, payload).subscribe((res: any) => {
      if (this.isVerified) {
        this._snackBar.open('Documents Verified Successfully', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      } else {
        this._snackBar.open('Documents Not Verified', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      }
      this.getStaffs();
    },
      (err: any) => {
        this._snackBar.open('Error in Verifying Documents', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      });
  }

}