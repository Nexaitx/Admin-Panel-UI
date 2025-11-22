import { Component, inject } from '@angular/core';
import { API_URL, ENDPOINTS } from '../../core/const';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-all-pharma-available-products',
  imports: [],
  templateUrl: './all-pharma-available-products.html',
  styleUrl: './all-pharma-available-products.scss'
})
export class AllPharmaAvailableProducts {
  http = inject(HttpClient);

  getAllAvailableProducts() {
    this.http.get(API_URL + ENDPOINTS.GET_ALL_PHARMACY_AVAILABLE_MEDICINE).subscribe((res: any) => {

    })
  }
}
