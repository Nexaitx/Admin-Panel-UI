import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Address — {{ data.name }}</h2>
    <mat-dialog-content>
      <p style="white-space: pre-wrap; line-height: 1.6;">{{ data.address }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class AddressDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string; address: string }) {}
}