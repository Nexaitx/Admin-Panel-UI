import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-google-map',
  imports: [GoogleMap, MapMarker],
  templateUrl: './google-map.html',
  styleUrl: './google-map.scss',
})
export class GoogleMaps  implements OnChanges{
  @Input() staffLat!: number;
  @Input() staffLng!: number;

  center: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0
  };
  zoom = 12;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.staffLat != null && this.staffLng != null) {
      this.center = {
        lat: Number(this.staffLat),
        lng: Number(this.staffLng)
      };
    }
  }
}
