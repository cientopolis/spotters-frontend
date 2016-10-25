import { CurrentLocationService } from './currentLocation.service';

import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';

import { Configuration } from '../providers/configuration';
import { ConfigurationProvider } from '../providers/configuration.provider';
import { Subscription } from 'rxjs/Subscription';
import { GoogleMapsLoader } from './mapLoader';

import _ from "lodash";

@Component({
    selector: 'streetview',
    template: '<div class="street" id="streetview_{{fix}}"></div>',
    providers: [ConfigurationProvider, GoogleMapsLoader]
})
export class PanoramaComponent implements OnInit {
    @Input() fix: string;
    panorama: any;
    configuration: Configuration;
    errorMessage: string;
    lat: number;
    subscription: Subscription;
    mapLoader: GoogleMapsLoader;

    constructor(mapLoader: GoogleMapsLoader, private configurationProvider: ConfigurationProvider, private currentLocation: CurrentLocationService) {
        this.mapLoader = mapLoader;
        this.subscription = currentLocation.lat$.subscribe(
            lat => {
                if (lat) {
                    this.lat = lat;
                    this.movePanorama();
                }
            });
    }

    public movePanorama(): void {
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                //this.geocoder = new _mapsApi.Map(document.getElementById("gmap"), { center: 123 });
                if (this.panorama) {
                    this.panorama.setPosition(new _mapsApi.LatLng(this.lat, this.currentLocation.lng))
                }

            });
    }

    public setPanorama(): void {
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                //this.geocoder = new _mapsApi.Map(document.getElementById("gmap"), { center: 123 });
                this.panorama = new _mapsApi.StreetViewPanorama(document.getElementById("streetview_" + this.fix), {
                    position: new _mapsApi.LatLng(this.lat, this.currentLocation.lng),
                    pov: {
                        heading: this.currentLocation.heading,
                        pitch: this.currentLocation.pitch
                    }
                });

            });
    }

    public getConfiguration(): void {
        this.configurationProvider.getAll().subscribe(
            c => {
                this.configuration = _.first(c);
                if (this.currentLocation.isBlank()) {
                    this.currentLocation.setLat(this.configuration.lat);
                    this.currentLocation.lng = this.configuration.lng;
                    this.currentLocation.heading = this.configuration.headingCenter;
                    this.currentLocation.pitch = this.configuration.pitchCenter;
                    this.currentLocation.refresh = true;
                }
                else {
                    this.lat = this.currentLocation.getLat();
                }

                this.setPanorama();
            },
            e => this.errorMessage = e);
    }

    public getWorkflow(): void {

    }

    ngOnInit(): void {
        this.getConfiguration();
    }
}
