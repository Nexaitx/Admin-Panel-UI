import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pharmaceuticals',
  imports: [CommonModule],
  templateUrl: './pharmaceuticals.html',
  styleUrl: './pharmaceuticals.scss'
})
export class Pharmaceuticals {
  tableData: any[] = []; // Array to hold JSON data
  headers: string[] = []; // Array to hold JSON keys for headers

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadSheetData();
  }

  

  loadSheetData(): void {
  const sheetId = '1_y6cpj0wDj8u6KRz9YopVnvGp8qi7BgAhe3seH7-Ysk';
  const gid = '0';  // sheet/tab id
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`;

  this.http.get(url, { responseType: 'text' })
    .subscribe(raw => {
      // raw is something like: google.visualization.Query.setResponse({...});
      const jsonText = raw.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/);
      if (!jsonText || jsonText.length < 2) {
        console.error('Unexpected Google Sheets JSON response format');
        return;
      }
      const data = JSON.parse(jsonText[1]);
      // data.table.rows has the rows, data.table.cols for column info
      const cols: any[] = data.table.cols;
      const rows: any[] = data.table.rows;
      this.headers = cols.map(c => c.label);
      this.tableData = rows.map(r => {
        const obj: any = {};
        r.c.forEach((cell: any, idx: number) => {
          const header = this.headers[idx];
          obj[header] = cell && cell.v != null ? cell.v : null;
        });
        return obj;
      });
    }, err => {
      console.error('Error fetching sheet data', err);
    });
}

}