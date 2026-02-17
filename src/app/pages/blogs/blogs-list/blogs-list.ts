import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnDef, CommonTableComponent } from '../../../shared/common-table/common-table.component';

@Component({
  selector: 'app-blogs-list',
  imports: [CommonTableComponent],
  templateUrl: './blogs-list.html',
  styleUrl: './blogs-list.scss',
})
export class BlogsList {
  dataSource = new MatTableDataSource<any>();
  columnsToDisplay: ColumnDef[] =
    [{ key: 'blogId', header: 'Blog&nbsp;ID', sortable: true },
    { key: 'title', header: 'Title', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'createdby', header: 'Created&nbsp;By', sortable: true },
    { key: 'createdOn', header: 'Created&nbsp;On', sortable: true },
    { key: 'updatedOn', header: 'Updated&nbsp;On', sortable: true },
    { key: 'featureImage', header: 'Feature&nbsp;Image' }
    ];

}
