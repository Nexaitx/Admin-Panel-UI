import { Component, inject, Input, ViewChild, TemplateRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ADMIN_PORTER, ENDPOINTS } from '../../../core/const';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

interface TableRider {
  id: number;
  name: string;
  mobile: string;
  email: string;
  licenseNumber: string;

  isOnline: boolean;
  active: boolean;
  available: boolean;

  hasVehicle: boolean;
  hasBankDetails: boolean;
  hasDocuments: boolean;
  hasPayment: boolean;
  hasOwner: boolean;

  createdAt: string;

  originalUser: any;
}

@Component({
  selector: 'app-riders',
  standalone: true,
  
  imports: [ MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatMenuModule,
    MatSidenavModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    
  ],
  templateUrl: './riders.html', 
  styleUrl: './riders.scss',
  providers: [DatePipe]
})



export class Riders {
  @Input() client: any;
  http = inject(HttpClient);
  dialog = inject(MatDialog);
  actionDialogRef!: MatDialogRef<any>;
  dialogTitle = '';
  dialogType: 'vehicle' | 'payment' | 'bank' | 'document' | 'owner' | 'verify' | 'reject' = 'vehicle';
  dialogData: any = null;
  selectedDriverId!: number;
  actionType: 'verify' | 'reject' = 'verify';
  confirmAction: 'activate' | 'deactivate' = 'activate';
  selectedRider: TableRider | null = null;
  actionValue = '';
  imagePreviewUrl = '';
  imagePreviewTitle = '';
  users: any[] = [];
  isDrawerOpen: boolean = false;
  selectedUser: TableRider | null = null;
  displayedColumns : string[] = [
  's_no',
  'id',
  'name',
  'mobile',
  'email',
  'licenseNumber',
  'isOnline',
  'active',
  'available',
  'hasVehicle',
  'hasBankDetails',
  'hasDocuments',
  'hasPayment',
  'hasOwner',
  'actions'
  ];
  dataSource: MatTableDataSource<TableRider>;
  cities: string[] = [];
  selectedCity: string = '';

  @ViewChild('detailsDialog')
  detailsDialog!: TemplateRef<any>;

  @ViewChild('imagePreviewDialog')
  imagePreviewDialog!: TemplateRef<any>;

  @ViewChild('confirmDialog')
confirmDialog!: TemplateRef<any>;

    @ViewChild('actionDialog')
    actionDialog!: TemplateRef<any>;


  @ViewChild('verifyDialog')
  verifyDialog!: TemplateRef<any>;

  @ViewChild('rejectDialog')
  rejectDialog!: TemplateRef<any>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex = 0;

  pageSize = 10;

  totalItems = 0;

  onPageChange(event: PageEvent){

    this.pageIndex = event.pageIndex;

    this.pageSize = event.pageSize;

    this.getRiders();

}

  constructor(private datePipe: DatePipe) {
    this.dataSource = new MatTableDataSource<TableRider>([]);
  }

  ngOnInit(): void {

    this.getRiders();

    this.dataSource.filterPredicate = (data: TableRider, filter: string) => {

      filter = filter.trim().toLowerCase();

      return (
        data.name.toLowerCase().includes(filter) ||
        data.mobile.toLowerCase().includes(filter) ||
        data.email.toLowerCase().includes(filter) ||
        data.licenseNumber.toLowerCase().includes(filter)
      );

    };

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  editElement(element: TableRider) {
    alert(`Editing: ${element.name} (User ID: ${element.id})`);
  }

  deleteElement(element: TableRider) {
    console.log(`Delete ${element.name} (ID: ${element.id})`);
    alert(`Deleting: ${element.name} (User ID: ${element.id})`);
  }

  openUserDrawer(element: TableRider) {
    this.selectedUser = element;
    this.isDrawerOpen = true;
  }

  closeUserDrawer() {
    this.isDrawerOpen = false;
    this.selectedUser = null;
  }

  mapAndSetDataSource(data: any[]) {

  this.dataSource.data = data.map(driver => ({

      id: driver.id,
      name: driver.name,
      mobile: driver.mobile,
      email: driver.email,
      licenseNumber: driver.licenseNumber,

      isOnline: driver.isOnline,
      active: driver.active,
      available: driver.available,

      hasVehicle: driver.hasVehicle,
      hasBankDetails: driver.hasBankDetails,
      hasDocuments: driver.hasDocuments,
      hasPayment: driver.hasPayment,
      hasOwner: driver.hasOwner,

      createdAt: driver.createdAt,

      originalUser: driver
  }));


    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  //<=--------------------------- DIALOGS ----------------------------->

  //<=--------------------------- Vehicle ----------------------------->
  openVehicleDialog(driverId: number) {

    this.dialogData = null;

    const url = `${ADMIN_PORTER}${
        ENDPOINTS.GET_DRIVER_BY_ID_VEHICLE.replace('{driverId}', driverId.toString())
    }`;

    this.http.get(url).subscribe({

      next: (res) => {

        this.dialogType = 'vehicle';
        this.dialogTitle = 'Vehicle Details';
        this.dialogData = res;

        this.dialog.open(this.detailsDialog, {
          width: '600px'
        });

      },

      error: (err) => {

        console.error(err);

      }

    });

  }
  //<=--------------------------- Payment ----------------------------->
  openPaymentDialog(driverId: number) {

    this.dialogData = null;

    const url = `${ADMIN_PORTER}${
      ENDPOINTS.GET_DRIVER_BY_ID_PAYMENT.replace(
        '{driverId}',
        driverId.toString()
      )
    }`;

    this.http.get(url).subscribe({

      next: (res) => {

        this.dialogType = 'payment';
        this.dialogTitle = 'Payment Details';
        this.dialogData = res;

        this.dialog.open(this.detailsDialog, {
          width: '600px'
        });

      },

      error: (err) => {
        console.error(err);
      }

    });

  }
  //<=--------------------------- Bank ----------------------------->
  openBankDialog(driverId: number) {

    this.selectedDriverId = driverId;

    this.dialogData = null;

    const url = `${ADMIN_PORTER}${
      ENDPOINTS.GET_DRIVER_BY_ID_BANK.replace(
        '{driverId}',
        driverId.toString()
      )
    }`;

    this.http.get(url).subscribe({

      next: (res) => {

        this.dialogType = 'bank';
        this.dialogTitle = 'Bank Details';
        this.dialogData = res;

        this.dialog.open(this.detailsDialog, {
          width: '600px'
        });

      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  //<=--------------------------- Verify/ Reject Bank ----------------------------->
  openActionDialog(type: 'verify' | 'reject') {

    this.actionType = type;
    this.actionValue = '';

    this.actionDialogRef = this.dialog.open(this.actionDialog, {
      width: '500px',
      maxHeight: '85vh'
    });

  }

  //<=--------------------------- Documents ----------------------------->
  openDocumentDialog(driverId: number) {

      this.dialogData = null;

      const url = `${ADMIN_PORTER}${
        ENDPOINTS.GET_DRIVER_BY_ID_DOC.replace(
          '{driverId}',
          driverId.toString()
        )
      }`;

      this.http.get(url).subscribe({

        next: (res) => {

          this.dialogType = 'document';
          this.dialogTitle = 'Driver Documents';
          this.dialogData = res;

          this.dialog.open(this.detailsDialog, {
            width: '700px'
          });

        },

        error: (err) => {
          console.error(err);
        }

      });

    }

  //<=--------------------------- Owner ----------------------------->
  // <=--------------------------- Owner Details ----------------------------->
openOwnerDialog(driverId: number) {

  this.dialogData = null;

  const url = `${ADMIN_PORTER}${
    ENDPOINTS.GET_DRIVER_BY_ID_OWNER.replace(
      '{driverId}',
      driverId.toString()
    )
  }`;

  this.http.get(url).subscribe({

    next: (res) => {

      this.dialogType = 'owner';
      this.dialogTitle = 'Rider Owner Details';
      this.dialogData = res;

      this.dialog.open(this.detailsDialog, {
        width: '600px'
      });

    },

    error: (err) => {
      console.error('Error fetching owner details:', err);
    }

  });

}

  openImagePreview(imageUrl: string, title: string = 'Preview') {

    this.imagePreviewUrl = imageUrl;
    this.imagePreviewTitle = title;

    this.dialog.open(this.imagePreviewDialog, {
      width: '90vw',
      maxWidth: '95vw',
      height: '90vh',
      panelClass: 'image-preview-dialog'
    });

  }  

submitAction() {

  if (this.actionType === 'verify') {

    const url = `${ADMIN_PORTER}${
      ENDPOINTS.POST_DRIVER_BANK_VERIFY.replace(
        '{driverId}',
        this.selectedDriverId.toString()
      )
    }`;

    const body = {
      verifiedBy: 'Admin',
      remarks: this.actionValue
    };

    this.http.post(url, body).subscribe({

      next: () => {

        // Close ONLY Verify dialog
        this.actionDialogRef.close();

        // Refresh Bank Details dialog
        this.refreshBankDetails();

      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  else {

    const url = `${ADMIN_PORTER}${
      ENDPOINTS.POST_DRIVER_BANK_REJECT.replace(
        '{driverId}',
        this.selectedDriverId.toString()
      )
    }`;

    const body = {
      rejectionReason: this.actionValue,
      rejectedBy: 'Admin'
    };

    this.http.post(url, body).subscribe({

      next: () => {

        // Close ONLY Reject dialog
        this.actionDialogRef.close();

        // Refresh Bank Details dialog
        this.refreshBankDetails();

      },

      error: (err) => {
        console.error(err);
      }

    });

  }

}

refreshBankDetails() {

  const url = `${ADMIN_PORTER}${
    ENDPOINTS.GET_DRIVER_BY_ID_BANK.replace(
      '{driverId}',
      this.selectedDriverId.toString()
    )
  }`;

  this.http.get(url).subscribe({

    next: (res: any) => {

      this.dialogData = res;

    },

    error: (err) => {

      console.error(err);

    }

  });

}


  getRiders() {
    this.http.get(
  `${ADMIN_PORTER}${ENDPOINTS.GET_DRIVERS}?page=${this.pageIndex}&size=${this.pageSize}&sortBy=createdAt&sortDirection=asc`
).subscribe({
      next: (res: any) => {
        this.users = res.content;

        this.totalItems = res.totalItems;

        this.mapAndSetDataSource(this.users);
      },
        error: (err) => {
          console.error('Error fetching users:', err);
        }
    })
  }

toggleDriverStatus(element: TableRider) {

  this.selectedRider = element;
  this.confirmAction = element.active ? 'deactivate' : 'activate';

  this.dialog.open(this.confirmDialog, {
    width: '400px',
    disableClose: true
  });
}

confirmToggleDriverStatus() {

  if (!this.selectedRider) {
    return;
  }

  const driverId = this.selectedRider.id;

  const url = `${ADMIN_PORTER}${
    ENDPOINTS.TOGGLE_DRIVER_STATUS.replace(
      '{driverId}',
      driverId.toString()
    )
  }`;

  this.http.post(url, {}).subscribe({

    next: (res: any) => {

      console.log('Driver status updated:', res);

      this.selectedRider!.active = res.active;

      this.dialog.closeAll();

      this.getRiders();

      this.selectedRider = null;
    },

    error: (err) => {

      console.error('Error updating driver status:', err);

      this.dialog.closeAll();

      alert(
        err?.error?.message ||
        'Failed to update rider status.'
      );

      this.selectedRider = null;
    }

  });
}

  
}
