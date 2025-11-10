import { Component } from '@angular/core';
import { Auth } from '../core/services/auth';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './loader.html',
  styleUrls: ['./loader.scss']
})
export class Loader {
  constructor(public loader: Auth) {}
}
