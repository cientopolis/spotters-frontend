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
    long: number;
    heading: number;
    pitch: number;
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

        this.subscription = currentLocation.lng$.subscribe(
            long => {
                if (long) {
                    this.long = long;
                    this.movePanorama();
                }
            });
    }

    public movePanorama(): void {
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                if (this.panorama) {
                    this.panorama.setPosition(new _mapsApi.LatLng(this.lat, this.long))
                }

            });
    }

    public setPanorama(): void {
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                this.panorama = new _mapsApi.StreetViewPanorama(document.getElementById("streetview_" + this.fix), {
                    position: new _mapsApi.LatLng(this.lat, this.long),
                    pov: {
                        heading: this.currentLocation.getHeading(),
                        pitch: this.currentLocation.getPitch()
                    }
                });

                this.panorama.addListener('position_changed', () => {
                    this.updateCurrentPosition();
                });
            });
    }

    public updateCurrentPosition(): void {
        if ((this.currentLocation.getLat() != this.panorama.getPosition().lat()) && (this.currentLocation.getLng() != this.panorama.getPosition().lng())) {

            console.log('Actualizando el panorama component !');
            this.currentLocation.setLat(this.panorama.getPosition().lat());
            this.currentLocation.setLng(this.panorama.getPosition().lng());
            this.currentLocation.setHeading(this.panorama.getPov().heading);
            this.currentLocation.setPitch(this.panorama.getPov().pitch);
        }
    }

    public getConfiguration(): void {
        this.configurationProvider.getAll().subscribe(
            c => {
                this.configuration = _.first(c);
                if (this.currentLocation.isBlank()) {
                    this.currentLocation.setLat(this.configuration.lat);
                    this.currentLocation.setLng(this.configuration.lng);
                    this.currentLocation.setHeading(this.configuration.headingCenter);
                    this.currentLocation.setPitch(this.configuration.pitchCenter);
                }
                else {
                    this.lat = this.currentLocation.getLat();
                    this.long = this.currentLocation.getLng();
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
