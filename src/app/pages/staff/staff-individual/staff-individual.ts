import { ChangeDetectionStrategy, Component, inject, Input, input, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
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
  isDrawerOpen = false;
  selectedStaff: any = null;
  @Input() staff: any;

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
  verification: boolean = false;
  @ViewChild('verificationDialog') verificationDialog!: TemplateRef<any>;
  dialog = inject(MatDialog);

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

  private _pushSub: any;

  ngOnInit() {
    this.getStaffs();
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = `${data.staffId} ${data.name} ${data.category} ${data.experience} ${data.price} ${data.gender} ${data.shiftType} ${data.profession} ${data.email} ${data.phoneNumber} ${data.rating} ${data.verified}`.toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };
    try {
      this._pushSub = pushMessages$.subscribe((msg: any) => {
        // msg is expected to be { from: 'service-worker', payload: {...} } or the payload itself
        const payload = msg && msg.payload ? msg.payload : msg;
        const title = payload?.notification?.title || payload?.data?.title || payload?.title;
        console.log('[staff-individual] received push payload:', payload);
        if (title === 'new added Staff') {
          console.log('[staff-individual] detected new added Staff notification — refreshing list');
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
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sort({ id: 'addedDate', start: 'desc', disableClear: true });
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
    alert(`Editing: ${element.name} (Staff ID: ${element.staffId})`);
  }

  openStaffDrawer(element: any) {
    this.selectedStaff = element;
    console.log('Selected Staff:', this.selectedStaff);
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
        this.dataSource.data = res;
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

  openVerificationDialog(m: any) {
    const dialogRef = this.dialog.open(this.verificationDialog, {
      width: '800px',
      minWidth: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
