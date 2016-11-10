import { CurrentLocationService } from './currentLocation.service';

import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { OnInit } from '@angular/core';

import { Configuration } from '../models/configuration';
import { Candidate } from '../models/candidate';
import { ConfigurationProvider } from '../providers/configuration.provider';
import { Subscription } from 'rxjs/Subscription';
import { GoogleMapsLoader } from './mapLoader';

import _ from "lodash";
import randomstring from 'randomstring';

@Component({
    selector: 'streetview',
    template: '<div class="street" id="streetview_{{fix}}"></div>',
    providers: [ConfigurationProvider, GoogleMapsLoader]
})
export class PanoramaComponent implements OnInit, OnChanges {
    @Input() fix: string = randomstring.generate();
    @Input() hidden: boolean = false;
    @Input() candidate: Candidate;
    panorama: any;
    configuration: Configuration;
    errorMessage: string;
    subscription: Subscription;
    mapLoader: GoogleMapsLoader;
    mapApi: any;

    constructor(mapLoader: GoogleMapsLoader, private configurationProvider: ConfigurationProvider, private currentLocationService: CurrentLocationService) {
        this.mapLoader = mapLoader;
        if (!this.candidate) {
            this.subscription = currentLocationService.refresh$.subscribe(
                refresh => {
                    if (refresh) {
                        currentLocationService.setRefresh(false);
                        this.movePanorama();
                        this.refreshPanorama();
                    }
                });
        }
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

    public setPanorama(latlng, pov): void {
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                this.mapApi = _mapsApi;
                this.panorama = new _mapsApi.StreetViewPanorama(document.getElementById("streetview_" + this.fix), {
                    position: latlng,
                    pov: pov
                });

                if (!this.candidate) {
                    this.panorama.addListener('position_changed', () => {
                        this.updateCurrentPosition();
                    });
                    this.panorama.addListener('pov_changed', () => {
                        this.updateCurrentPosition();
                    });
                }
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

                this.setPanorama({
                    lat: this.currentLocationService.getLat(),
                    lng: this.currentLocationService.getLng()
                }, {
                        heading: this.currentLocationService.getHeading(),
                        pitch: this.currentLocationService.getPitch()
                    });
            },
            e => this.errorMessage = e);
    }

    public getWorkflow(): void {

    }

    ngOnInit(): void {
        if (this.candidate) {
            this.setPanorama({
                lat: this.candidate.lat,
                lng: this.candidate.lng
            }, {
                    heading: this.candidate.heading,
                    pitch: this.candidate.pitch
                });
        } else {
            this.getConfiguration();
        }
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (let propName in changes) {
            if (this.panorama && propName === 'hidden') {
                this.mapApi.event.trigger(this.panorama, 'resize');
            }
        }
    }
}
