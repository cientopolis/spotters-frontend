import { CurrentLocationService } from '../../utils/currentLocation.service';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Configuration } from '../../providers/configuration';
import { ConfigurationProvider } from '../../providers/configuration.provider';

import _ from "lodash";

declare var google: any;
@Component({
  selector: 'page-panorama',
  templateUrl: 'panorama.html',
  providers: [ConfigurationProvider, CurrentLocationService]
})
export class PanoramaPage implements OnInit {
  panorama: any;
  configuration: Configuration;
  errorMessage: string;

  constructor(public navCtrl: NavController, private configurationProvider: ConfigurationProvider, private currentLocation: CurrentLocationService) { }

  public setPanorama(): void {
    this.panorama = new google.maps.StreetViewPanorama(document.getElementById('streetview'), {
      position: new google.maps.LatLng(this.currentLocation.lat, this.currentLocation.lng),
      pov: {
        heading: this.currentLocation.heading,
        pitch: this.currentLocation.pitch
      }
    });

    //console.log(this.panorama);
  }

  public getConfiguration(): void {
    this.configurationProvider.getAll().subscribe(
      c => {
        this.configuration = _.first(c);

        if (this.currentLocation.isBlank()) {
          console.log('its blank');
          console.log(this.currentLocation);
          this.currentLocation.lat = this.configuration.lat;
          this.currentLocation.lng = this.configuration.lng;
          this.currentLocation.heading = this.configuration.headingCenter;
          this.currentLocation.pitch = this.configuration.pitchCenter;
          this.currentLocation.refresh = true;
        }

        console.log(this.currentLocation);
        this.setPanorama();
      },
      e => this.errorMessage = e);
  }

  ngOnInit(): void {
    this.getConfiguration();
  }
}
