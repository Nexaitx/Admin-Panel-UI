import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { API_URL, ENDPOINTS } from '../../core/const';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-diet-onboard-users',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './diet-onboard-users.html',
  styleUrl: './diet-onboard-users.scss'
})
export class DietOnboardUsers implements OnInit, AfterViewInit {
  http = inject(HttpClient);
  dietUsers: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'fullName',
    'age',
    'gender',
    'height',
    'weight',
    'dietPreference',
    'activityLevel',
    'dailyWaterIntake',
    'foodPreference',
    'foodAvoid',
    'breakfast',
    'lunch',
    'dinner',
    'anyMedication',
    'medication',
    'medicalCondition',
    'sleep',
    'wakeup'
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getDietUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // Custom filter predicate to search across all columns
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.trim().toLowerCase();
      return Object.keys(data).some((key) => {
        if (key === 'medicalCondition' && Array.isArray(data[key])) {
          return data[key].join(' ').toLowerCase().includes(searchText);
        }
        if (key === 'anyMedication') {
          return (data[key] ? 'Yes' : 'No').toLowerCase().includes(searchText);
        }
        return data[key]?.toString().toLowerCase().includes(searchText);
      });
    };
  }

  getDietUsers(): void {
    this.http.get(API_URL + ENDPOINTS.GET_USERS_ONBOARD_DIET).subscribe({
      next: (data: any) => {
        this.dietUsers = data;
        this.dataSource.data = this.dietUsers;
      },
      error: (error) => {
        console.error('Error fetching diet users:', error);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to first page on filter
    }
  }
}