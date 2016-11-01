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
    subscription: Subscription;
    mapLoader: GoogleMapsLoader;

    constructor(mapLoader: GoogleMapsLoader, private configurationProvider: ConfigurationProvider, private currentLocationService: CurrentLocationService) {
        this.mapLoader = mapLoader;
        this.subscription = currentLocationService.refresh$.subscribe(
            refresh => {
                if (refresh) {
                    currentLocationService.setRefresh(false);
                    this.movePanorama();
                    this.refreshPanorama();
                }
            });
    }

    public movePanorama(): void {
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                if (this.panorama && !(this.currentLocationService.getLat() === this.panorama.getPosition().lat() && this.currentLocationService.getLng() === this.panorama.getPosition().lng())) {
                    this.panorama.setPosition(new _mapsApi.LatLng(this.currentLocationService.getLat(), this.currentLocationService.getLng()));
                    this.panorama.setPov({
                        heading: this.currentLocationService.getHeading(),
                        pitch: this.currentLocationService.getPitch()
                    });
                }
            });
    }

    public refreshPanorama(): void {
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                if (this.panorama && !(this.currentLocationService.getHeading() === this.panorama.getPov().heading && this.currentLocationService.getPitch() === this.panorama.getPov().pitch)) {
                    this.panorama.setPov({
                        heading: this.currentLocationService.getHeading(),
                        pitch: this.currentLocationService.getPitch()
                    });
                }
            });
    }

    public setPanorama(): void {
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                this.panorama = new _mapsApi.StreetViewPanorama(document.getElementById("streetview_" + this.fix), {
                    position: new _mapsApi.LatLng(this.currentLocationService.getLat(), this.currentLocationService.getLng()),
                    pov: {
                        heading: this.currentLocationService.getHeading(),
                        pitch: this.currentLocationService.getPitch()
                    }
                });

                this.panorama.addListener('position_changed', () => {
                    this.updateCurrentPosition();
                });
                this.panorama.addListener('pov_changed', () => {
                    this.updateCurrentPosition();
                });
            });
    }

    public updateCurrentPosition(): void {
        if (this.panorama && !this.currentLocationService.getRefresh() && !this.currentLocationService.isEqualTo(this.panorama.getPosition().lat(), this.panorama.getPosition().lng(), this.panorama.getPov().heading, this.panorama.getPov().pitch)) {
            this.currentLocationService.setLat(this.panorama.getPosition().lat());
            this.currentLocationService.setLng(this.panorama.getPosition().lng());
            this.currentLocationService.setHeading(this.panorama.getPov().heading);
            this.currentLocationService.setPitch(this.panorama.getPov().pitch);
            this.currentLocationService.setRefresh(true);
        }
    }

    public getConfiguration(): void {
        this.configurationProvider.getAll().subscribe(
            c => {
                this.configuration = _.first(c);
                if (this.currentLocationService.isBlank()) {
                    this.currentLocationService.setLat(this.configuration.lat);
                    this.currentLocationService.setLng(this.configuration.lng);
                    this.currentLocationService.setHeading(this.configuration.headingCenter);
                    this.currentLocationService.setPitch(this.configuration.pitchCenter);
                    this.currentLocationService.setRefresh(true);
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
