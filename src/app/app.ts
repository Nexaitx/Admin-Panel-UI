import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    Loader
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'admin-panel';
}
