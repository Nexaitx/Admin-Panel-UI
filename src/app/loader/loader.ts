import { Component } from '@angular/core';
import { Auth } from '../core/services/auth';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader {
constructor(public loader: Auth) {}
}
