import { ChangeDetectionStrategy, Component, inject, Input, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
    's_no', 'staffId', 'name', 'phoneNumber', 'email', 'address', 'city',
    'gender', 'experience', 'category', 'subcategory', 'dutyTimeStart',
    'dutyTimeEnd', 'shiftType', 'price', 'rating', 'verified', 'status', 'actions'
  ];

  isActive: boolean = false;
  verification: boolean = false;
  @ViewChild('verificationDialog') verificationDialog!: TemplateRef<any>;
  @ViewChild('staffStatus') staffStatus!: TemplateRef<any>;
  dialog = inject(MatDialog);

  dataSource: MatTableDataSource<any>;
  states: any;
  subcategories: any;

  //  Pagination state (server-side)
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  sortBy = 'staffId';
  sortDirection: 'asc' | 'desc' = 'asc';

  experiences = [
    { value: '', viewValue: 'All Experience' },
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

    //  Initial fetch
    this.getStaffs();

    //  Client-side filter (current page only)
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
  }

  ngAfterViewInit(): void {
    //  Server-side pagination — DO NOT attach dataSource.paginator / dataSource.sort
    this.sort.sortChange.subscribe((s: any) => {
      this.sortBy = s.active || 'staffId';
      this.sortDirection = (s.direction || 'asc') as 'asc' | 'desc';
      this.pageIndex = 0;
      if (this.paginator) this.paginator.firstPage();
      this.getStaffs();
    });

    this.paginator.page.subscribe((page: PageEvent) => {
      this.pageIndex = page.pageIndex;
      this.pageSize = page.pageSize;
      this.getStaffs();
    });
  }

  updatePrice(element: any) {
    switch (element.selectedShift) {
      case '08:00': element.calculatedPrice = element.eightPrice; break;
      case '12:00': element.calculatedPrice = element.twelveHourPrice; break;
      case '24:00': element.calculatedPrice = element.twentyFourHourPrice; break;
      case '1month8hours': element.calculatedPrice = element.monthly8price; break;
      case '1month12hours': element.calculatedPrice = element.monthly12price; break;
      case '1month24hours': element.calculatedPrice = element.monthly24price; break;
      default: element.calculatedPrice = '';
    }
  }

  getSubCategories() {
    this.http.get(API_URL + ENDPOINTS.GET_SUB_CATEGORIES).subscribe({
      next: (res: any) => { this.subcategories = res; },
      error: (err) => console.error('Error fetching subcategories:', err)
    });
  }

  getStates() {
    this.http.get(API_URL + ENDPOINTS.GET_STATES).subscribe({
      next: (res: any) => { this.states = res; },
      error: (err) => console.error('Error fetching states:', err)
    });
  }

  private mapDefaultShiftOnData(data: any[]) {
    return data.map(el => ({
      ...el,
      selectedShift: el.category === 'nurse' ? '08:00' : '1month8hours',
      calculatedPrice: el.category === 'nurse' ? el.eightPrice : el.monthly8price
    }));
  }

  //  Filter API (kept as-is, no pagination params — backend default)
  getStaffByFilter() {
    let params = new HttpParams();
    if (this.selectedCity) params = params.set('state', String(this.selectedCity));
    if (this.selectedSubcategory) params = params.set('subCategory', String(this.selectedSubcategory));
    if (this.selectedExperience && this.selectedExperience.trim() !== '') {
      params = params.set('experience', this.selectedExperience);
    }
    if (this.selectedShiftType && this.selectedShiftType.trim() !== '') {
      params = params.set('shiftType', this.selectedShiftType);
    }
    if (this.selectedDutyTime) {
      const timeDate = new Date(this.selectedDutyTime);
      if (!isNaN(timeDate.getTime())) {
        const formattedTime = timeDate.toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit', hour12: true
        });
        params = params.set('startTime', formattedTime);
      }
    }

    this.http.get(API_URL + ENDPOINTS.GET_STAFF_FILTER, { params }).subscribe({
      next: (res: any) => {
        const reversed = Array.isArray(res) ? [...res].reverse() : res;
        this.dataSource.data = this.mapDefaultShiftOnData(reversed);
        //  Filter API has no pagination meta → reset paginator
        this.totalElements = this.dataSource.data.length;
      },
      error: (err) => console.error('Error fetching filtered staffs:', err)
    });
  }

  resetFilters() {
    this.globalFilterValue = '';
    this.selectedCity = null;
    this.selectedSubcategory = null;
    this.selectedExperience = '';
    this.selectedShiftType = '';
    this.selectedDutyTime = '';
    this.pageIndex = 0;
    if (this.paginator) this.paginator.firstPage();
    this.getStaffs();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  editElement(element: any) {
    alert(`Editing: ${element.name} (Staff ID: ${element.staffId})`);
  }

  openStaffDrawer(element: any) {
    this.selectedStaff = element;
    this.isDrawerOpen = true;
  }

  closeStaffDrawer() { this.isDrawerOpen = false; }

  deleteElement(element: any) {
    alert(`Deleting: ${element.name} (Staff ID: ${element.staffId})`);
  }

  /**
   *  NEW: Server-side paginated staff API
   * GET /api/staff/allstaff/pagination?page=0&size=10&sortBy=staffId&direction=asc
   */
  getStaffs() {
    let params = new HttpParams()
      .set('page', String(this.pageIndex))
      .set('size', String(this.pageSize))
      .set('sortBy', this.sortBy)
      .set('direction', this.sortDirection);

    this.http.get<any>(API_URL + ENDPOINTS.GET_STAFFS_PAGINATED, { params }).subscribe({
      next: (res: any) => {
        //  Spring Pageable response unwrap
        const content = Array.isArray(res) ? res : (res?.content ?? []);
        const total = res?.totalElements ?? content.length;

        this.allStaffs = content;
        this.dataSource.data = this.mapDefaultShiftOnData(content);

        this.totalElements = total;

        //  sync paginator length
        if (this.paginator) {
          this.paginator.length = total;
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
        }
      },
      error: (err) => {
        console.error('Error fetching staffs:', err);
        this.dataSource.data = [];
        this.totalElements = 0;
      }
    });
  }

  refreshData() { this.ngOnInit(); }

  openStaffDisableDialog(m: any) {
    this.dialog.open(this.staffStatus, { width: '600px', data: {} });
  }

  disableStaff() {
    const payload = {
      staffIds: [this.selectedStaff.staffId],
      isActive: this.isActive
    };
    this.http.post(API_URL + ENDPOINTS.DISABLE_STAFF, payload).subscribe({
      next: () => {
        this.getStaffs();
        this._snackBar.open(
          this.isActive ? 'Staff Active Successfully' : 'Staff In-Active Successfully',
          'Close', { duration: 3000, panelClass: ['snackbar-success'] }
        );
      },
      error: () => {
        this._snackBar.open('Error in Staff Active/In-Active', 'Close',
          { duration: 3000, panelClass: ['snackbar-error'] });
      }
    });
  }

  openVerificationDialog(m: any) {
    this.isVerified = this.selectedStaff.verified;
    this.dialog.open(this.verificationDialog, {
      width: '850px', minWidth: '850px', data: {}
    });
  }

  verifyStaffDocuments() {
    const payload = {
      staffIds: [this.selectedStaff?.staffId],
      isVerified: this.isVerified,
      reason: this.reason
    };
    this.http.post(API_URL + ENDPOINTS.VERIFY_STAFF, payload).subscribe({
      next: () => {
        this._snackBar.open(
          this.isVerified ? 'Documents Verified Successfully' : 'Documents Not Verified',
          'Close', { duration: 3000, panelClass: ['snackbar-success'] }
        );
        this.getStaffs();
      },
      error: () => {
        this._snackBar.open('Error in Verifying Documents', 'Close',
          { duration: 3000, panelClass: ['snackbar-error'] });
      }
    });
  }
}