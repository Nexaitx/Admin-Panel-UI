import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

interface Account {
  name: string;
  role: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-manage-accounts',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './manage-accounts.html',
  styleUrls: ['./manage-accounts.scss'],
})
export class ManageAccounts implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Account>([]);
  displayedColumns = ['name', 'role', 'email', 'phone', 'action'];

  roles: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRoles();
    // this.loadAccounts(); API is not available yet
  }

  loadRoles() {
    this.http.get(API_URL + ENDPOINTS.GET_ROLES)
      .subscribe((res: any) => this.roles = res.role);
  }

  loadAccounts(roleFilter: string = '') {
    let endpoint = API_URL + ENDPOINTS.GET_ACCOUNTS;
    if (roleFilter) {
      endpoint += `?role=${roleFilter}`;
    }
    this.http.get<Account[]>(endpoint)
      .subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      });
  }

  onRoleChange(event: any) {
    this.loadAccounts(event.value);
  }

  onEdit(user: Account) {
    // open edit dialog or route to edit
  }

  onDelete(user?: Account) {
    // delete single or selected users
  }

  onCreate() {
    // open create dialog or navigation
  }
}
