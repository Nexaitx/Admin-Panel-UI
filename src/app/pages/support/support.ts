import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-support',
  imports: [MatIconModule,
    MatButtonModule],
  templateUrl: './support.html',
  styleUrl: './support.scss'
})
export class Support {
  constructor(private dialog: MatDialog) { }
  isChatWindowVisible = false;

  openChat(): void {
    this.isChatWindowVisible = true;
  }

  closeChat(): void {
    this.isChatWindowVisible = false;
  }
}
