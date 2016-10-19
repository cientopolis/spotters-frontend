import { CurrentLocationService } from './currentLocation.service';

import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';

import { Configuration } from '../providers/configuration';
import { ConfigurationProvider } from '../providers/configuration.provider';
import { Subscription } from 'rxjs/Subscription';

import _ from "lodash";

declare var google: any;

@Component({
    selector: 'streetview',
    template: '<div class="street" id="streetview_{{fix}}"></div>',
    providers: [ConfigurationProvider]
})
export class PanoramaComponent implements OnInit {
    @Input() fix: string;
    panorama: any;
    configuration: Configuration;
    errorMessage: string;
    lat: number;
    subscription: Subscription;

    constructor(private configurationProvider: ConfigurationProvider, private currentLocation: CurrentLocationService) {
        this.subscription = currentLocation.lat$.subscribe(
            lat => {
                if (lat) {
                    console.log('en el panorama llega la latitud ' + lat);
                    this.lat = lat;
                    this.movePanorama();
                }
            });
    }

    public movePanorama(): void {
        if (this.panorama) {
            this.panorama.setPosition(new google.maps.LatLng(this.lat, this.currentLocation.lng))
        }
    }

    public setPanorama(): void {
        console.log('seteo el panorama con');
        console.log(this.lat);
        console.log(this.currentLocation.lng);

        this.panorama = new google.maps.StreetViewPanorama(document.getElementById("streetview_" + this.fix), {
            position: new google.maps.LatLng(this.lat, this.currentLocation.lng),
            pov: {
                heading: this.currentLocation.heading,
                pitch: this.currentLocation.pitch
            }
        });
    }

    public getConfiguration(): void {
        this.configurationProvider.getAll().subscribe(
            c => {
                this.configuration = _.first(c);
                console.log('en el panorama, chequeo si es blank');
                if (this.currentLocation.isBlank()) {
                    console.log('el panorama dice que es blank');
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
