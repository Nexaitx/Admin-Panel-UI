import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-permissions',
  imports: [MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './permissions.html',
  styleUrl: './permissions.scss'
})
export class Permissions {
  private readonly _formBuilder = inject(FormBuilder);
  http = inject(HttpClient);
  roles : any;

  readonly toppings = this._formBuilder.group({
    pepperoni: false,
    extracheese: false,
    mushroom: false,
  });

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this.http.get(API_URL + ENDPOINTS.GET_ROLES).subscribe({
      next: (res: any) => {
        this.roles = res.role
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
